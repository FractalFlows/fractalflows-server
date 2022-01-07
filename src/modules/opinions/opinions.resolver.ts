import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SessionGuard } from '../auth/auth.guard';
import { OpinionsService } from './opinions.service';
import { Opinion } from './entities/opinion.entity';
import { SaveOpinionInput } from './dto/save-opinion.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ClaimsService } from '../claims/claims.service';

@Resolver(() => Opinion)
export class OpinionsResolver {
  constructor(
    private readonly opinionsService: OpinionsService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Mutation(() => Opinion)
  @UseGuards(SessionGuard)
  async saveOpinion(
    @Args('saveOpinionInput', { type: () => SaveOpinionInput })
    saveOpinionInput: SaveOpinionInput,
    @CurrentUser() user: User,
  ) {
    const x = await this.opinionsService.save({
      ...saveOpinionInput,
      user,
    });
    console.log(x);
    return x;
  }

  @Query(() => Opinion, { name: 'opinion' })
  findOne(@Args('id') id: string) {
    return this.opinionsService.findOne({
      where: { id },
      relations: [
        'user',
        'arguments',
        'arguments.evidences',
        'arguments.comments',
      ],
    });
  }

  @Mutation(() => Opinion)
  removeOpinion(@Args('id', { type: () => Int }) id: number) {
    return this.opinionsService.remove(id);
  }
}
