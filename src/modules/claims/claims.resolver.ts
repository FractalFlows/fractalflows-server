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
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

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
    @CurrentUser() user: User,
  ) {
    await this.sourcesService.createMany(createClaimInput.sources);
    await this.attributionsService.createMany(createClaimInput.attributions);
    await this.tagsService.createMany(createClaimInput.tags);

    return await this.claimsService.create({
      ...createClaimInput,
      user,
    });
  }

  @Query(() => Claim, { name: 'claim' })
  async findOne(@Args('slug') slug: string) {
    return await this.claimsService.findOne({
      where: { slug },
      relations: ['user', 'tags', 'sources'],
    });
  }

  @Query(() => [Claim], { name: 'claims' })
  async find(
    @Args('limit', { type: () => Int }) limit = 20,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return await this.claimsService.find({
      take: limit,
      skip: offset,
    });
  }

  @Query(() => [Claim], { name: 'trendingClaims' })
  async findTrendingClaims(
    @Args('limit', { type: () => Int }) limit = 20,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return await this.claimsService.find({
      take: limit,
      skip: offset,
    });
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
