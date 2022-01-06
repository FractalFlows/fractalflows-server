import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { KnowledgeBitVotesService } from './knowledge-bit-votes.service';
import {
  KnowledgeBitVote,
  KnowledgeBitVoteTypes,
} from './entities/knowledge-bit-vote.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SessionGuard } from '../auth/auth.guard';
import { ClaimsService } from '../claims/claims.service';
import { In } from 'typeorm';

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
    @Args('type', { type: () => KnowledgeBitVoteTypes })
    type: KnowledgeBitVoteTypes,
    @CurrentUser() user: User,
  ) {
    const knowledgeBitVote = await this.knowledgeBitVotesService.findOne({
      where: {
        knowledgeBit: knowledgeBitId,
        user,
      },
    });

    if (knowledgeBitVote) {
      if (knowledgeBitVote.type === type) {
        await this.knowledgeBitVotesService.delete(knowledgeBitVote.id);
      } else {
        await this.knowledgeBitVotesService.save({
          id: knowledgeBitVote.id,
          type,
        });
      }
    } else {
      await this.knowledgeBitVotesService.save({
        knowledgeBit: knowledgeBitId,
        type,
        user,
      });
    }

    return true;
  }

  @Query(() => [KnowledgeBitVote], { name: 'userKnowledgeBitsVotes' })
  async getUserKnowledgeBitsVotes(@Args('claimSlug') claimSlug: string) {
    const claim = await this.claimsService.findOne({
      where: { slug: claimSlug },
      relations: ['knowledgeBits'],
    });
    const knowledgeBitsIds = claim.knowledgeBits.map(({ id }) => id);

    return await this.knowledgeBitVotesService.find({
      where: {
        knowledgeBit: In(knowledgeBitsIds),
      },
      relations: ['knowledgeBit'],
    });
  }
}
