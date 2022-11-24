import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

import { KnowledgeBitVotesService } from './knowledge-bit-votes.service';
import {
  KnowledgeBitVote,
  KnowledgeBitVoteTypes,
} from './entities/knowledge-bit-vote.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SessionGuard } from '../auth/auth.guard';
import { ClaimsService } from '../claims/claims.service';

@Resolver(() => KnowledgeBitVote)
export class KnowledgeBitVotesResolver {
  constructor(
    private readonly knowledgeBitVotesService: KnowledgeBitVotesService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async saveKnowledgeBitVote(
    @Args('knowledgeBitId') knowledgeBitId: string,
    @Args('voteType', { type: () => KnowledgeBitVoteTypes })
    voteType: KnowledgeBitVoteTypes,
    @CurrentUser() user: User,
  ) {
    const knowledgeBitVote = await this.knowledgeBitVotesService.findOne({
      where: {
        knowledgeBit: {
          id: knowledgeBitId,
        },
        user: { id: user.id },
      },
    });

    if (knowledgeBitVote) {
      await this.knowledgeBitVotesService.delete({
        id: knowledgeBitVote.id,
      });
    }

    if (
      voteType === KnowledgeBitVoteTypes.UPVOTE ||
      voteType === KnowledgeBitVoteTypes.DOWNVOTE
    ) {
      await this.knowledgeBitVotesService.save({
        type: voteType,
        knowledgeBit: knowledgeBitId as any,
        user,
      });
    }

    return true;
  }

  @Query(() => [KnowledgeBitVote], {
    name: 'userKnowledgeBitVotes',
    nullable: true,
  })
  async getUserKnowledgeBitVotes(
    @Args('claimSlug') claimSlug: string,
    @CurrentUser() user: User,
  ) {
    if (user) {
      const claim = await this.claimsService.findOne({
        where: { slug: claimSlug },
        relations: ['knowledgeBits'],
      });
      const knowledgeBitsIds = claim.knowledgeBits.map(({ id }) => id);

      return await this.knowledgeBitVotesService.find({
        where: {
          knowledgeBit: { id: In(knowledgeBitsIds) },
          user: { id: user.id },
        },
        relations: ['knowledgeBit', 'user'],
      });
    } else {
      return null;
    }
  }
}
