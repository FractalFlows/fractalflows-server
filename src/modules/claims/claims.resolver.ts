import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ClaimsService } from './claims.service';
import { Claim } from './entities/claim.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { SourcesService } from '../sources/sources.service';
import { AttributionsService } from '../attributions/attributions.service';
import { TagsService } from '../tags/tags.service';
import { SessionGuard } from '../auth/auth.guard';
import { UserClaimRelation } from './dto/get-user-claim.input';
import { UsersService } from '../users/users.service';

@Resolver(() => Claim)
export class ClaimsResolver {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
    private readonly attributionsService: AttributionsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Claim)
  @UseGuards(SessionGuard)
  async createClaim(
    @Args('createClaimInput') createClaimInput: CreateClaimInput,
    @Context() context,
  ) {
    await this.sourcesService.createMany(createClaimInput.sources);
    await this.attributionsService.createMany(createClaimInput.attributions);
    await this.tagsService.createMany(createClaimInput.tags);

    return await this.claimsService.create({
      ...createClaimInput,
      user: context.req.session.user,
    });
  }

  @Query(() => [Claim], { name: 'claims' })
  findAll() {
    return this.claimsService.findAll();
  }

  @Query(() => Claim, { name: 'claim' })
  findOne(@Args('slug') slug: string) {
    return this.claimsService.findOne(slug);
  }

  @Query(() => [Claim], { name: 'userClaims' })
  async findUserClaims(
    @Args('username') username: string,
    @Args('relation', { type: () => UserClaimRelation })
    relation: UserClaimRelation,
  ) {
    const user = await this.usersService.findOne({ where: { username } });

    switch (relation) {
      case UserClaimRelation.OWN:
        return await this.claimsService.findByUserId(user.id);
      case UserClaimRelation.CONTRIBUTED:
        return await this.claimsService.find({});
      case UserClaimRelation.FOLLOWING:
        return await this.claimsService.findByUserId(user.id);
      default:
        return [];
    }
  }

  @Mutation(() => Claim)
  @UseGuards(SessionGuard)
  updateClaim(@Args('updateClaimInput') updateClaimInput: UpdateClaimInput) {
    return this.claimsService.update(updateClaimInput.id, updateClaimInput);
  }

  @Mutation(() => Claim)
  @UseGuards(SessionGuard)
  removeClaim(@Args('id', { type: () => Int }) id: number) {
    return this.claimsService.remove(id);
  }
}
