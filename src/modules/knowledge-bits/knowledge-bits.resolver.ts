import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { KnowledgeBitsService } from './knowledge-bits.service';
import { KnowledgeBit } from './entities/knowledge-bit.entity';
import { CreateKnowledgeBitInput } from './dto/create-knowledge-bit.input';
import { UpdateKnowledgeBitInput } from './dto/update-knowledge-bit.input';
import { AttributionsService } from '../attributions/attributions.service';
import { ClaimsService } from '../claims/claims.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';

@Resolver(() => KnowledgeBit)
export class KnowledgeBitsResolver {
  constructor(
    private readonly knowledgeBitsService: KnowledgeBitsService,
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

  @Query(() => [KnowledgeBit], { name: 'knowledgeBit' })
  findAll() {
    return this.knowledgeBitsService.findAll();
  }

  @Query(() => KnowledgeBit, { name: 'knowledgeBit' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.knowledgeBitsService.findOne(id);
  }

  @Mutation(() => KnowledgeBit)
  @UseGuards(SessionGuard)
  updateKnowledgeBit(
    @Args('updateKnowledgeBitInput')
    updateKnowledgeBitInput: UpdateKnowledgeBitInput,
  ) {
    return this.knowledgeBitsService.update(
      updateKnowledgeBitInput.id,
      updateKnowledgeBitInput,
    );
  }

  @Mutation(() => KnowledgeBit)
  removeKnowledgeBit(@Args('id', { type: () => Int }) id: number) {
    return this.knowledgeBitsService.remove(id);
  }
}
