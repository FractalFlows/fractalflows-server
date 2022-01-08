import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
import { InviteFriendsInput } from './dto/invite-friends.input';

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
    await this.sourcesService.save(createClaimInput.sources);
    await this.attributionsService.upsert(createClaimInput.attributions);
    await this.tagsService.save(createClaimInput.tags);

    return await this.claimsService.create({
      ...createClaimInput,
      user,
    });
  }

  @Query(() => Claim, { name: 'claim' })
  async findOne(@Args('slug') slug: string) {
    return await this.claimsService.findOne({
      where: { slug },
      relations: [
        'user',
        'tags',
        'sources',
        'attributions',
        'arguments',
        'arguments.opinions',
        'arguments.opinions.user',
        'opinions',
        'opinions.user',
      ],
    });
  }

  @Query(() => [Claim], { name: 'claims' })
  async find(
    @Args('limit', { type: () => Int }) limit = 20,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return await this.claimsService.find({
      relations: ['user', 'tags'],
      take: limit,
      skip: offset,
    });
  }

  @Query(() => [Claim], { name: 'trendingClaims' })
  async findTrending(
    @Args('limit', { type: () => Int }) limit = 20,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return await this.claimsService.find({
      relations: ['user', 'tags'],
      take: limit,
      skip: offset,
    });
  }

  @Query(() => [Claim], { name: 'relatedClaims' })
  async findRelated(@Args('slug') slug: string) {
    return await this.claimsService.findRelated(slug);
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
  async updateClaim(
    @Args('updateClaimInput') updateClaimInput: UpdateClaimInput,
  ) {
    await this.sourcesService.save(updateClaimInput.sources);
    await this.attributionsService.save(updateClaimInput.attributions);
    await this.tagsService.save(updateClaimInput.tags);
    await this.claimsService.update(updateClaimInput.id, updateClaimInput);

    return await this.claimsService.findOne(updateClaimInput.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async deleteClaim(@Args('id') id: string) {
    await this.claimsService.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async inviteFriends(
    @Args('inviteFriendsInput') inviteFriendsInput: InviteFriendsInput,
    @CurrentUser() user: User,
  ) {
    return await this.claimsService.inviteFriends({
      user,
      inviteFriendsInput,
    });
  }
}
