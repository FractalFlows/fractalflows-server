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
    await this.attributionsService.upsert(createKnowledgeBitInput.attributions);

    return await this.knowledgeBitsService.create({
      ...createKnowledgeBitInput,
      claim: await this.claimsService.findOne({
        where: { slug: claimSlug },
      }),
      user,
    });
  }

  @Query(() => KnowledgeBit, { name: 'knowledgeBit' })
  async find(@Args('id') id: string) {
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
    await this.attributionsService.save(updateKnowledgeBitInput.attributions);
    await this.knowledgeBitsService.update(
      updateKnowledgeBitInput.id,
      updateKnowledgeBitInput,
    );

    return await this.knowledgeBitsService.findOne(updateKnowledgeBitInput.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async deleteKnowledgeBit(@Args('id') id: string) {
    await this.knowledgeBitsService.softDelete(id);
    return true;
  }
}
