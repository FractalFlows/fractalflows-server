import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { KnowledgeBitsService } from './knowledge-bits.service';
import {
  KnowledgeBit,
  KnowledgeBitSides,
} from './entities/knowledge-bit.entity';
import { CreateKnowledgeBitInput } from './dto/create-knowledge-bit.input';
import { UpdateKnowledgeBitInput } from './dto/update-knowledge-bit.input';
import { AttributionsService } from '../attributions/attributions.service';
import { ClaimsService } from '../claims/claims.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { KnowledgeBitVotesService } from '../knowledge-bit-votes/knowledge-bit-votes.service';
import { KnowledgeBitVoteTypes } from '../knowledge-bit-votes/entities/knowledge-bit-vote.entity';
import { getClaimURL } from 'src/common/utils/claim';
import { Attribution } from '../attributions/entities/attribution.entity';

@Resolver(() => KnowledgeBit)
export class KnowledgeBitsResolver {
  constructor(
    private readonly knowledgeBitsService: KnowledgeBitsService,
    private readonly knowledgeBitVotesService: KnowledgeBitVotesService,
    private readonly attributionsService: AttributionsService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Mutation(() => KnowledgeBit)
  @UseGuards(SessionGuard)
  async createKnowledgeBit(
    @Args('claimSlug') claimSlug: string,
    @Args('createKnowledgeBitInput')
    createKnowledgeBitInput: CreateKnowledgeBitInput,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { slug: claimSlug },
    });

    await this.attributionsService.upsert(createKnowledgeBitInput.attributions);
    const createKnowledgeBit = await this.knowledgeBitsService.create({
      ...createKnowledgeBitInput,
      claim: await this.claimsService.findOne({
        where: { slug: claimSlug },
      }),
      user,
    });

    this.claimsService.notifyFollowers({
      id: claim.id,
      subject: 'A claim you follow has a new knowledge bit',
      html: `
      The claim <a href="${getClaimURL(claim.slug)}">${
        claim.title
      }</a> that you are following has a new ${
        createKnowledgeBit.side === KnowledgeBitSides.REFUTING
          ? 'refuting'
          : 'supporting'
      } knowledge bit: "${createKnowledgeBit.name}"
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyOwner({
      id: claim.id,
      subject: 'Your claim has a new knowledge bit',
      html: `
      Your claim <a href="${getClaimURL(claim.slug)}">${
        claim.title
      }</a> has a new ${
        createKnowledgeBit.side === KnowledgeBitSides.REFUTING
          ? 'refuting'
          : 'supporting'
      } knowledge bit: "${createKnowledgeBit.name}"
      `,
      triggeredBy: user,
    });
    this.knowledgeBitsService.notifyNewlyAddedAttributions({
      attributions: createKnowledgeBitInput.attributions as Attribution[],
      claimSlug: claim.slug,
      claimTitle: claim.title,
      name: createKnowledgeBit.name,
    });

    return await this.findOne(createKnowledgeBit.id);
  }

  @Query(() => KnowledgeBit, { name: 'knowledgeBit' })
  async findOne(@Args('id') id: string) {
    const knowledgeBit = await this.knowledgeBitsService.findOne({
      where: { id },
      relations: ['user', 'attributions'],
    });

    return {
      ...knowledgeBit,
      upvotesCount: await this.knowledgeBitVotesService.countVotes({
        knowledgeBitId: knowledgeBit.id,
        type: KnowledgeBitVoteTypes.UPVOTE,
      }),
      downvotesCount: await this.knowledgeBitVotesService.countVotes({
        knowledgeBitId: knowledgeBit.id,
        type: KnowledgeBitVoteTypes.DOWNVOTE,
      }),
    };
  }

  @Query(() => [KnowledgeBit], { name: 'knowledgeBits' })
  async findAll(@Args('claimSlug') claimSlug: string) {
    const claim = await this.claimsService.findOne({
      where: { slug: claimSlug },
      relations: [
        'knowledgeBits',
        'knowledgeBits.user',
        'knowledgeBits.attributions',
      ],
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    return await Promise.all(
      claim.knowledgeBits?.map(async (knowledgeBit) => ({
        ...knowledgeBit,
        upvotesCount: await this.knowledgeBitVotesService.countVotes({
          knowledgeBitId: knowledgeBit.id,
          type: KnowledgeBitVoteTypes.UPVOTE,
        }),
        downvotesCount: await this.knowledgeBitVotesService.countVotes({
          knowledgeBitId: knowledgeBit.id,
          type: KnowledgeBitVoteTypes.DOWNVOTE,
        }),
      })) || [],
    );
  }

  // @Query(() => [KnowledgeBit], { name: 'searchKnowledgeBits' })
  // async search(
  //   @Args('claimSlug') claimSlug: string,
  //   @Args('side', { type: () => KnowledgeBitSides }) side: KnowledgeBitSides,
  //   @Args('term', { nullabe: true})
  // ) {
  //   const claim = await this.claimsService.findOne({
  //     where: { slug: claimSlug },
  //     relations: [],
  //   });

  //   return this.knowledgeBitsService.search(term);
  // }

  @Mutation(() => KnowledgeBit)
  @UseGuards(SessionGuard)
  async updateKnowledgeBit(
    @Args('updateKnowledgeBitInput')
    updateKnowledgeBitInput: UpdateKnowledgeBitInput,
  ) {
    const knowledgeBit = await this.knowledgeBitsService.findOne({
      where: { id: updateKnowledgeBitInput.id },
      relations: ['claim', 'attributions'],
    });

    await this.attributionsService.save(updateKnowledgeBitInput.attributions);
    await this.knowledgeBitsService.update(
      updateKnowledgeBitInput.id,
      updateKnowledgeBitInput,
    );

    const updatedKnowledgeBit = await this.findOne(updateKnowledgeBitInput.id);

    this.knowledgeBitsService.notifyNewlyAddedAttributions({
      attributions: updatedKnowledgeBit.attributions,
      existing: knowledgeBit.attributions,
      claimSlug: knowledgeBit.claim.slug,
      claimTitle: knowledgeBit.claim.title,
      name: knowledgeBit.name,
    });

    return updatedKnowledgeBit;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async deleteKnowledgeBit(@Args('id') id: string) {
    await this.knowledgeBitsService.softDelete(id);
    return true;
  }
}
