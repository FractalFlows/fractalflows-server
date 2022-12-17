import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';
import JSZip from 'jszip';
import FileType from 'file-type';
import * as W3Name from 'w3name';

import { sendMail } from 'src/common/services/mail';
import { User } from '../users/entities/user.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { InviteFriendsInput } from './dto/invite-friends.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { Claim } from './entities/claim.entity';
import { Attribution } from '../attributions/entities/attribution.entity';
import { getClaimURL } from 'src/common/utils/claim';
import { AttributionsService } from '../attributions/attributions.service';
import { Cron, Timeout } from '@nestjs/schedule';
import {
  getCIDAndPathfromIPFSURI,
  getIPFSGatewayURIFromIPFSURI,
} from 'src/common/utils/ipfs';
import { IPFS } from 'src/common/services/ipfs';
import { KnowledgeBitSides } from '../knowledge-bits/entities/knowledge-bit.entity';

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
    createClaimInput: CreateClaimInput & {
      user: User;
      oceanFileURI: string;
      oceanIpnsKey: Buffer;
      oceanIpnsName: string;
    },
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
    } while (!!(await this.claimsRepository.findOne({ where: { slug } })));

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

  async update(id: string, updateClaimInput: Partial<UpdateClaimInput>) {
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

  /*
    Zips files and updates Ocean listing
  */
  // @Cron('0 0 0 * * *', {
  //   name: 'zipFilesAndUpdateIPNSName',
  // })
  @Timeout(0)
  async zipFilesAndUpdateIPNSName() {
    const fetchIPFSFile = async (ipfsURI: string) => {
      const gatewayURI = getIPFSGatewayURIFromIPFSURI(ipfsURI);

      try {
        const response = await fetch(gatewayURI);
        const file = await response.arrayBuffer();

        return file;
      } catch (e) {
        console.error(e);
      }
    };

    const getUniqueFilename = (name: string, existingNames: string[] = []) => {
      const baseFilename = slugify(name.substring(0, 50), {
        lower: true,
        strict: true,
      });
      let filename;
      let filenameIndex = 0;

      do {
        filename = `${baseFilename}${
          filenameIndex > 0 ? `_${filenameIndex}` : ''
        }`;
        filenameIndex++;
      } while (existingNames.includes(filename));

      return filename;
    };

    const getKnowledgeBitFiles = async (knowledgeBits: any) => {
      const knowledgeBitsFiles = await knowledgeBits.reduce(
        async (acc, knowledgeBit) => {
          acc = await acc;

          const knowledgeBitMetadataFile = await fetchIPFSFile(
            knowledgeBit.nftMetadataURI,
          );
          const knowledgeBitFile = await fetchIPFSFile(knowledgeBit.fileURI);
          const knowledgeBitFileType = await FileType.fromBuffer(
            knowledgeBitFile,
          );
          const knowledgeBitFilename = getUniqueFilename(
            knowledgeBit.name,
            acc.filenames,
          );

          return {
            filenames: [...(acc.filenames || []), knowledgeBitFilename],
            files: {
              ...(acc.files || {}),
              [`${knowledgeBitFilename}.json`]: knowledgeBitMetadataFile,
              [`${knowledgeBitFilename}_file${
                knowledgeBitFileType ? `.${knowledgeBitFileType.ext}` : ''
              }`]: knowledgeBitFile,
            },
          };
        },
        {},
      );

      return knowledgeBitsFiles;
    };

    const getArgumentCommentsFiles = async (argumentsComments: any) => {
      const argumentsFiles = await argumentsComments.reduce(
        async (acc, argumentsComment) => {
          acc = await acc;

          const argumentCommentMetadataFile = await fetchIPFSFile(
            argumentsComment.nftMetadataURI,
          );
          const argumentCommentFilename = getUniqueFilename(
            argumentsComment.content,
            acc.filenames,
          );

          return {
            filenames: [...(acc.filenames || []), argumentCommentFilename],
            files: {
              ...(acc.files || {}),
              [`${argumentCommentFilename}.json`]: argumentCommentMetadataFile,
            },
          };
        },
        {},
      );

      return argumentsFiles;
    };

    const getArgumentsFiles = async (arguments_: any) => {
      const argumentsFiles = await arguments_.reduce(async (acc, argument) => {
        acc = await acc;

        const argumentMetadataFile = await fetchIPFSFile(
          argument.nftMetadataURI,
        );
        const argumentCommentsMetadataFiles = await getArgumentCommentsFiles(
          argument.comments,
        );
        const argumentFilename = getUniqueFilename(
          argument.summary,
          acc.filenames,
        );

        return {
          filenames: [...(acc.filenames || []), argumentFilename],
          files: {
            ...(acc.files || {}),
            [`${argumentFilename}.json`]: argumentMetadataFile,
          },
          folders: {
            [`${argumentFilename}_comments`]: argumentCommentsMetadataFiles,
          },
        };
      }, {});

      return argumentsFiles;
    };

    const getOpinionsFiles = async (opinions: any) => {
      const opinionsFiles = await opinions.reduce(async (acc, opinion, i) => {
        acc = await acc;

        const opinionMetadataFile = await fetchIPFSFile(opinion.nftMetadataURI);
        const opinionFilename = `opinion_${i}`;

        return {
          filenames: [...(acc.filenames || [])],
          files: {
            ...(acc.files || {}),
            [`${opinionFilename}.json`]: opinionMetadataFile,
          },
        };
      }, {});

      return opinionsFiles;
    };

    const writeFilesToFolder = (
      getFolder,
      { files = {}, folders = {} } = {},
    ) => {
      const filesKeys = Object.keys(files);
      const foldersKeys = Object.keys(folders);

      if (filesKeys.length === 0 && foldersKeys.length === 0) return;

      const folder = getFolder();

      filesKeys.map((filename) => {
        folder.file(filename, files[filename]);
      });
      foldersKeys.map((foldername) => {
        writeFilesToFolder(
          () => folder.folder(foldername),
          folders[foldername],
        );
      });
    };

    const claims = await this.claimsRepository.find({
      relations: [
        'arguments',
        'arguments.comments',
        'knowledgeBits',
        'opinions',
      ],
    });

    claims.reduce(async (acc, claim) => {
      return acc.then(async () => {
        // stop if claim doesn't have new data to be zipped
        if (claim.updatedAt < (claim.oceanIpnsNameUpdatedAt ?? 0)) {
          return;
        }

        const zip = new JSZip();

        const claimFile = await fetchIPFSFile(claim.nftMetadataURI);
        const refutingKnowledgeBitFiles = await getKnowledgeBitFiles(
          claim.knowledgeBits.filter(
            ({ side }) => side === KnowledgeBitSides.REFUTING,
          ),
        );
        const supportingKnowledgeBitFiles = await getKnowledgeBitFiles(
          claim.knowledgeBits.filter(
            ({ side }) => side === KnowledgeBitSides.SUPPORTING,
          ),
        );
        const argumentsFiles = await getArgumentsFiles(claim.arguments);
        const opinionsFiles = await getOpinionsFiles(claim.opinions);

        zip.file(`${getUniqueFilename(claim.title, [])}.json`, claimFile);

        writeFilesToFolder(
          () => zip.folder('refuting_knowledge_bits'),
          refutingKnowledgeBitFiles,
        );
        writeFilesToFolder(
          () => zip.folder('supporting_knowledge_bits'),
          supportingKnowledgeBitFiles,
        );
        writeFilesToFolder(() => zip.folder('arguments'), argumentsFiles);
        writeFilesToFolder(() => zip.folder('opinions'), opinionsFiles);

        const file = await zip.generateAsync({ type: 'blob' });
        const fileURI = await IPFS.uploadFile(file, 'data.zip');

        const ipnsName = await W3Name.from(claim.oceanIpnsKey);
        const ipnsRevision = await W3Name.resolve(ipnsName);
        const ipnsNextRevision = await W3Name.increment(
          ipnsRevision,
          `/ipfs/${getCIDAndPathfromIPFSURI(fileURI)}`,
        );

        await W3Name.publish(ipnsNextRevision, ipnsName.key);

        const updatedAt = new Date();

        await this.save({
          id: claim.id,
          updatedAt,
          oceanFileURI: fileURI,
          oceanIpnsNameUpdatedAt: new Date(updatedAt.getTime() + 1),
        });
      });
    }, Promise.resolve());
  }
}
