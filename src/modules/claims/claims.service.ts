import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { sendMail } from 'src/common/services/mail';
import { User } from '../users/entities/user.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { InviteFriendsInput } from './dto/invite-friends.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { Claim } from './entities/claim.entity';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim) private claimsRepository: Repository<Claim>,
  ) {}

  async create(createClaimInput: CreateClaimInput & { user: User }) {
    let slug;
    let slugIndex = 0;

    do {
      slug = `${slugify(createClaimInput.title, {
        lower: true,
        strict: true,
      })}${slugIndex > 0 ? `-${slugIndex}` : ''}`;

      slugIndex++;
    } while (
      (await this.claimsRepository.findOne({ where: { slug } })) !== undefined
    );

    return await this.claimsRepository.save({ ...createClaimInput, slug });
  }

  async findAll() {
    return await this.claimsRepository.find();
  }

  async findRelated(slug: string) {
    const claim = await this.claimsRepository.findOne({
      where: { slug },
      relations: ['tags'],
    });

    if (claim.tags.length > 0) {
      return await this.claimsRepository
        .createQueryBuilder('claim')
        .leftJoinAndSelect('claim.user', 'user')
        .leftJoinAndSelect('claim.tags', 'tags')
        .innerJoin('claim.tags', 'tag', 'tag.id IN (:...tagIds)', {
          tagIds: claim.tags.map(({ id }) => id),
        })
        .where('claim.slug != :slug', { slug })
        .take(3)
        .getMany();
    } else {
      return Promise.resolve([]);
    }
  }

  async find(query) {
    return await this.claimsRepository.find(query);
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

  async findByUserId(userId: string) {
    return await this.claimsRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findOne(query) {
    return await this.claimsRepository.findOne(query);
  }

  async update(id: string, updateClaimInput: UpdateClaimInput) {
    return await this.claimsRepository.save({ ...updateClaimInput, id });
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
}
