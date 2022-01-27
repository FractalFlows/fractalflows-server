import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';

import { sendMail } from 'src/common/services/mail';
import { User } from '../users/entities/user.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { InviteFriendsInput } from './dto/invite-friends.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { Claim } from './entities/claim.entity';
import { Attribution } from '../attributions/entities/attribution.entity';
import { getClaimURL } from 'src/common/utils/claim';
import { AttributionsService } from '../attributions/attributions.service';

export const CLAIM_CORE_RELATIONS = [
  'user',
  'tags',
  'knowledgeBits',
  'opinions',
  'opinions.user',
];

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim) private claimsRepository: Repository<Claim>,
    private readonly attributionsService: AttributionsService,
  ) {}

  async create(
    createClaimInput: CreateClaimInput & { user: User },
  ): Promise<Claim> {
    const baseSlug = slugify(createClaimInput.title, {
      lower: true,
      strict: true,
    });
    let slug;
    let slugIndex = 0;

    do {
      slug = `${baseSlug}${slugIndex > 0 ? `-${slugIndex}` : ''}`;
      slugIndex++;
    } while (
      (await this.claimsRepository.findOne({ where: { slug } })) !== undefined
    );

    return await this.claimsRepository.save({ ...createClaimInput, slug });
  }

  async findAll() {
    return await this.claimsRepository.find();
  }

  async count() {
    return await this.claimsRepository.count();
  }

  async findTrending({ limit, offset }: { limit: number; offset: number }) {
    return await this.claimsRepository
      .createQueryBuilder('claim')
      .select('claim.id')
      .addSelect('COUNT(knowledgeBits.id) as knowledgeBitsCount')
      .leftJoin('claim.knowledgeBits', 'knowledgeBits')
      .groupBy('claim.id')
      .orderBy('knowledgeBitsCount', 'DESC')
      .addOrderBy('claim.updatedAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .execute();
  }

  async findRelated(slug: string) {
    const claim = await this.claimsRepository.findOne({
      where: { slug },
      relations: ['tags'],
    });
    const tagIds = claim.tags.map(({ id }) => id);

    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.tags.length > 0) {
      return await this.claimsRepository
        .createQueryBuilder('claim')
        .leftJoinAndSelect('claim.user', 'user')
        .leftJoinAndSelect('claim.tags', 'tags')
        .innerJoin('claim.tags', 'tag', 'tag.id IN (:...tagIds)', {
          tagIds,
        })
        .where('claim.slug != :slug', { slug })
        .limit(3)
        .getMany();
    } else {
      return Promise.resolve([]);
    }
  }

  async findDisabled({ limit, offset }: { limit: number; offset: number }) {
    const disabledClaims = await this.claimsRepository.find({
      where: { disabled: true },
      relations: CLAIM_CORE_RELATIONS,
      take: limit,
      skip: offset,
      order: {
        deletedAt: 'DESC',
      },
      withDeleted: true,
    });

    return {
      totalCount: await this.claimsRepository.count({
        where: { disabled: true },
        withDeleted: true,
      }),
      data: disabledClaims,
    };
  }

  async find(query) {
    return await this.claimsRepository.find(query);
  }

  async findIn(ids: string[]) {
    return await this.claimsRepository.find({
      where: { id: In(ids) },
      relations: CLAIM_CORE_RELATIONS,
    });
  }

  async countByTag({ tagSlug }) {
    return await this.claimsRepository
      .createQueryBuilder('claim')
      .innerJoin('claim.tags', 'claimTag', 'claimTag.slug = :tagSlug', {
        tagSlug,
      })
      .getCount();
  }

  async findByTag({ tagSlug, limit, offset }) {
    return await this.claimsRepository
      .createQueryBuilder('claim')
      .innerJoin('claim.tags', 'claimTag', 'claimTag.slug = :tagSlug', {
        tagSlug,
      })
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async search({ term }) {
    return await this.claimsRepository.query(
      `
      select id, count(*) OVER() AS totalCount, ts_rank(p_search.document, to_tsquery('''${term}'':*')) as relevance from (
        select claim.id as id,
          setweight(to_tsvector("claim"."title"), 'A') ||
          setweight(to_tsvector("claim"."summary"),  'A') ||
       		-- setweight(to_tsvector(coalesce(string_agg("tag"."label", ' '))), 'B') ||
          setweight(to_tsvector("user"."username"), 'C') as document
        from claim
        join "user" ON "user"."id" = "claim"."userId"
        left join claim_tags_tag ON "claim_tags_tag"."claimId" = "claim"."id"
        left join tag ON tag.id = "claim_tags_tag"."tagId"
        group by claim.id, "user"."id"
      ) p_search where p_search.document @@ to_tsquery('''${term}'':*')
      ORDER BY relevance DESC
    `,
    );
  }

  async findOne(query) {
    return await this.claimsRepository.findOne(query);
  }

  async update(id: string, updateClaimInput: UpdateClaimInput) {
    return await this.claimsRepository.save({ ...updateClaimInput, id });
  }

  async save(query) {
    return await this.claimsRepository.save(query);
  }

  async reenable(id: string) {
    await this.claimsRepository.restore(id);
    await this.claimsRepository.update(id, { disabled: false });

    return true;
  }

  async softDelete(id: string) {
    return await this.claimsRepository.softDelete(id);
  }

  async inviteFriends({
    user,
    inviteFriendsInput: { slug, emails, message },
  }: {
    user: User;
    inviteFriendsInput: InviteFriendsInput;
  }) {
    const claim = await this.claimsRepository.findOne({ where: { slug } });
    const blockquoteMessage = message
      ? `
      <blockquote>
        <strong>${user.username}:</strong> "${message}"
      </blockquote>
    `
      : '';

    await sendMail({
      to: emails,
      subject: `${user.username} has invited you to participate in a claim`,
      html: `
        Hello,<br /><br />

        <strong>${user.username}</strong> has invited you to participate in the <a href="${process.env.FRONTEND_HOST}/claim/${claim.slug}">${claim.title}</a> claim.

        ${blockquoteMessage}        
      `,
    });

    return true;
  }

  async notifyFollowers({
    id,
    subject,
    html,
    triggeredBy,
  }: {
    id: string;
    subject: string;
    html: string;
    triggeredBy: User;
  }) {
    const claim = await this.claimsRepository.findOne({
      where: { id },
      relations: ['followers'],
      withDeleted: true,
    });

    if (claim.followers && claim.followers.length > 0) {
      await sendMail({
        to: claim.followers
          .filter(({ id }) => id !== triggeredBy.id)
          .map(({ email }) => email)
          .filter(Boolean),
        subject,
        html,
      });
    }

    return true;
  }

  async notifyOwner({
    id,
    subject,
    html,
    triggeredBy,
  }: {
    id: string;
    subject: string;
    html: string;
    triggeredBy: User;
  }) {
    const claim = await this.claimsRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!claim.user.email || claim.user.id === triggeredBy.id) return;

    await sendMail({
      to: claim.user.email,
      subject,
      html,
    });

    return true;
  }

  async notifyNewlyAddedAttributions({
    attributions,
    existing,
    slug,
    title,
  }: {
    attributions: Attribution[];
    existing?: Attribution[];
    slug: string;
    title: string;
  }) {
    this.attributionsService.notifyNewlyAdded({
      attributions,
      existing,
      subject: 'A claim has been attributed to you',
      html: `
          Fractal Flows is now hosting a claim that has been attributed to you. Visit it to participate: <a href="${getClaimURL(
            slug,
          )}">${title}</a>
        `,
    });

    return true;
  }
}
