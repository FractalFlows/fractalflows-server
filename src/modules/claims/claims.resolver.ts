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
import { In } from 'typeorm';
import { PaginatedClaims } from './dto/paginated-claims.output';

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
        'arguments.comments',
        'arguments.opinions',
        'arguments.opinions.user',
        'opinions',
        'opinions.user',
      ],
    });
  }

  @Query(() => PaginatedClaims, { name: 'claims' })
  async find(
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return {
      totalCount: await this.claimsService.count(),
      data: await this.claimsService.find({
        relations: ['user', 'tags', 'knowledgeBits'],
        take: limit,
        skip: offset,
        order: {
          createdAt: 'DESC',
        },
      }),
    };
  }

  @Query(() => PaginatedClaims, { name: 'trendingClaims' })
  async findTrending(
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    const trendingClaims = await this.claimsService.findTrending({
      limit,
      offset,
    });
    const trendingClaimsIds = trendingClaims.map(({ claim_id }) => claim_id);
    const completeTrendingClaims = await this.claimsService.find({
      where: { id: In(trendingClaimsIds) },
      relations: ['user', 'tags', 'knowledgeBits'],
    });

    return {
      totalCount: await this.claimsService.count(),
      data: trendingClaimsIds.map((id) =>
        completeTrendingClaims.find(
          (completeTrendingClaim) => completeTrendingClaim.id === id,
        ),
      ),
    };
  }

  @Query(() => [Claim], { name: 'relatedClaims' })
  async findRelated(@Args('slug') slug: string) {
    return await this.claimsService.findRelated(slug);
  }

  @Query(() => PaginatedClaims, { name: 'searchClaims', nullable: true })
  async searchClaims(
    @Args('term') term: string,
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    const searchedClaims = await this.claimsService.search({ term });
    const searchedClaimsIds = searchedClaims
      .slice(offset, offset + limit)
      .map(({ id }) => id);
    const completeSearchedClaims = await this.claimsService.find({
      where: { id: In(searchedClaimsIds) },
      relations: ['user', 'tags'],
    });
    const weightedSearchedClaims = completeSearchedClaims.map(
      (searchedClaim) => ({
        ...searchedClaim,
        relevance: searchedClaims.find(({ id }) => searchedClaim.id === id)
          .relevance,
      }),
    );

    return {
      totalCount: searchedClaims.length,
      data: weightedSearchedClaims,
    };
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
