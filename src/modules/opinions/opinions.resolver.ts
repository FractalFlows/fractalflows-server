import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SessionGuard } from '../auth/auth.guard';
import { OpinionsService } from './opinions.service';
import { Opinion } from './entities/opinion.entity';
import { SaveOpinionInput } from './dto/save-opinion.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ClaimsService } from '../claims/claims.service';
import { getClaimURL } from 'src/common/utils/claim';

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
    const claim = await this.claimsService.findOne(saveOpinionInput.claim.id);
    const opinion = await this.opinionsService.save({
      ...saveOpinionInput,
      user,
    });
    if (saveOpinionInput.id === undefined) {
      this.claimsService.notifyFollowers({
        id: claim.id,
        subject: 'A claim you follow has a new opinion',
        html: `
          The claim <a href="${getClaimURL(claim.slug)}">${
          claim.title
        }</a> you follow has a new opinion from <b>${user.username}</b>`,
        triggeredBy: user,
      });
      this.claimsService.notifyOwner({
        id: claim.id,
        subject: 'Your claim has a new opinion',
        html: `
          Your claim <a href="${getClaimURL(claim.slug)}">${
          claim.title
        }</a> has a new opinion from <b>${user.username}</b>`,
        triggeredBy: user,
      });
    }

    return await this.opinionsService.findOne({
      where: { id: opinion.id },
      relations: ['arguments', 'arguments.comments', 'claim', 'user'],
    });
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
        'arguments.opinions',
        'arguments.opinions.user',
      ],
    });
  }

  @Query(() => Opinion, { name: 'userOpinion', nullable: true })
  async findUserOpinion(
    @Args('claimSlug') claimSlug: string,
    @CurrentUser() user: User,
  ) {
    if (user) {
      const claim = await this.claimsService.findOne({
        where: { slug: claimSlug },
      });
      const opinion = await this.opinionsService.findOne({
        where: { claim, user },
        relations: ['arguments', 'arguments.comments', 'claim', 'user'],
      });
      return opinion;
    } else {
      return Promise.resolve();
    }
  }

  @Mutation(() => Opinion)
  removeOpinion(@Args('id', { type: () => Int }) id: number) {
    return this.opinionsService.remove(id);
  }
}
