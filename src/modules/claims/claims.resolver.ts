import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

import { ClaimsService, CLAIM_CORE_RELATIONS } from './claims.service';
import { Claim, ClaimNFTStatuses } from './entities/claim.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { SourcesService } from '../sources/sources.service';
import { AttributionsService } from '../attributions/attributions.service';
import { TagsService } from '../tags/tags.service';
import { AdminGuard, SessionGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { InviteFriendsInput } from './dto/invite-friends.input';
import { PaginatedClaims } from './dto/paginated-claims.output';
import { getClaimURL } from 'src/common/utils/claim';
import { IPFS } from 'src/common/services/ipfs';

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
    const upsertedTags = await this.tagsService.save(createClaimInput.tags);

    const claim = await this.claimsService.create({
      ...createClaimInput,
      tags: upsertedTags.identifiers,
      user,
    });

    this.claimsService.notifyNewlyAddedAttributions({
      attributions: claim.attributions,
      slug: claim.slug,
      title: claim.title,
    });

    return claim;
  }

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async saveClaimMetadataOnIPFS(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { id },
      relations: ['tags', 'sources', 'attributions'],
    });

    const url = await IPFS.uploadClaimMetadata(claim);

    await this.claimsService.update(id, {
      nftMetadataURI: url,
      nftMetadataURICreatedAt: new Date(),
    });

    return url;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async saveClaimTxId(
    @Args('id') id: string,
    @Args('txId') txId: string,
    @CurrentUser() user: User,
  ) {
    await this.claimsService.update(id, {
      nftTxId: txId,
      nftStatus: ClaimNFTStatuses.MINTING,
    });
    return true;
  }

  @Query(() => Claim, { name: 'claim' })
  async findOne(@Args('slug') slug: string) {
    const claim = await this.claimsService.findOne({
      where: { slug },
      relations: [
        'user',
        'tags',
        'sources',
        'attributions',
        'arguments',
        'followers',
        'arguments.comments',
        'arguments.opinions',
        'arguments.opinions.user',
        'opinions',
        'opinions.user',
      ],
    });

    if (claim) {
      return claim;
    } else {
      throw new Error('Claim not found');
    }
  }

  @Query(() => PaginatedClaims, { name: 'claims' })
  async find(
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    return {
      totalCount: await this.claimsService.count(),
      data: await this.claimsService.find({
        relations: CLAIM_CORE_RELATIONS,
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
    const completeTrendingClaims = await this.claimsService.findIn(
      trendingClaimsIds,
    );

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
    const relatedClaims = await this.claimsService.findRelated(slug);
    const completeRelatedClaims = await this.claimsService.findIn(
      relatedClaims.map(({ id }) => id),
    );

    return completeRelatedClaims;
  }

  @Query(() => PaginatedClaims, { name: 'disabledClaims' })
  @UseGuards(AdminGuard)
  async findDisabled(
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    const disabledClaims = await this.claimsService.findDisabled({
      limit,
      offset,
    });

    return disabledClaims;
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
    const completeSearchedClaims = await this.claimsService.findIn(
      searchedClaimsIds,
    );
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
  async findUserClaims(@Args('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    const userClaims = await this.claimsService.find({
      where: { user },
      relations: CLAIM_CORE_RELATIONS,
      order: {
        createdAt: 'DESC',
      },
    });

    return userClaims;
  }

  @Query(() => PaginatedClaims, { name: 'claimsByTag' })
  async findClaimsByTag(
    @Args('tag') tagSlug: string,
    @Args('limit', { type: () => Int }) limit = 10,
    @Args('offset', { type: () => Int }) offset = 0,
  ) {
    const claimsBySlugTotalCount = await this.claimsService.countByTag({
      tagSlug,
    });
    const claimsBySlug = await this.claimsService.findByTag({
      tagSlug,
      limit,
      offset,
    });
    const claimsBySlugIds = claimsBySlug.map(({ id }) => id);
    const completeClaimsBySlug = await this.claimsService.findIn(
      claimsBySlugIds,
    );

    return {
      totalCount: claimsBySlugTotalCount,
      data: completeClaimsBySlug,
    };
  }

  @Query(() => [Claim], { name: 'userContributedClaims' })
  async findUserContributedClaims(@Args('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username },
      relations: [
        'knowledgeBits',
        'knowledgeBits.claim',
        'arguments',
        'arguments.claim',
        'opinions',
        'opinions.claim',
        'knowledgeBitVotes',
        'knowledgeBitVotes.knowledgeBit',
        'knowledgeBitVotes.knowledgeBit.claim',
      ],
    });
    const knowledgeBitsClaimIds = user.knowledgeBits.map(
      ({ claim }) => claim?.id,
    );
    const knowledgeBitVotesClaimIds = user.knowledgeBitVotes.map(
      ({ knowledgeBit }) => knowledgeBit?.claim?.id,
    );
    const argumentsClaimIds = user.arguments.map(({ claim }) => claim?.id);
    const opinionsClaimIds = user.opinions.map(({ claim }) => claim?.id);
    const userContributedClaimsIds = [
      ...knowledgeBitsClaimIds,
      ...knowledgeBitVotesClaimIds,
      ...argumentsClaimIds,
      ...opinionsClaimIds,
    ].filter((id) => id !== undefined);
    const userContributedClaims = await this.claimsService.find({
      where: { id: In(userContributedClaimsIds) },
      relations: CLAIM_CORE_RELATIONS,
      order: {
        createdAt: 'DESC',
      },
    });

    return userContributedClaims;
  }

  @Query(() => [Claim], { name: 'userFollowingClaims' })
  async findUserFollowingClaims(@Args('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username },
      relations: [
        'followingClaims',
        ...CLAIM_CORE_RELATIONS.map(
          (relation) => `followingClaims.${relation}`,
        ),
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return user.followingClaims;
  }

  @Mutation(() => Claim)
  @UseGuards(SessionGuard)
  async updateClaim(
    @Args('updateClaimInput') updateClaimInput: UpdateClaimInput,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { id: updateClaimInput.id },
      relations: ['attributions'],
    });

    await this.sourcesService.save(updateClaimInput.sources);
    await this.attributionsService.save(updateClaimInput.attributions);
    const upsertedTags = await this.tagsService.save(updateClaimInput.tags);
    await this.claimsService.update(updateClaimInput.id, {
      ...updateClaimInput,
      tags: upsertedTags.identifiers,
    });

    const updatedClaim = await this.claimsService.findOne({
      where: { id: updateClaimInput.id },
      relations: ['attributions'],
    });

    this.claimsService.notifyFollowers({
      id: updatedClaim.id,
      subject: 'A claim you follow has been updated',
      html: `
        The claim <a href="${getClaimURL(updatedClaim.slug)}">${
        claim.title
      }</a> you follow has been updated by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyOwner({
      id: updatedClaim.id,
      subject: 'Your claim has been updated',
      html: `
        Your claim <a href="${getClaimURL(updatedClaim.slug)}">${
        claim.title
      }</a> has been updated by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyNewlyAddedAttributions({
      attributions: updatedClaim.attributions,
      existing: claim.attributions,
      slug: updatedClaim.slug,
      title: updatedClaim.title,
    });

    return updatedClaim;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async deleteClaim(@Args('id') id: string, @CurrentUser() user: User) {
    const claim = await this.claimsService.findOne({ where: { id } });

    await this.claimsService.softDelete(id);

    this.claimsService.notifyFollowers({
      id,
      subject: 'A claim you follow has been deleted',
      html: `
        The claim "${claim.title}" you follow has been deleted by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyOwner({
      id,
      subject: 'Your claim has been deleted',
      html: `
        Your claim "${claim.title}" has been deleted by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });

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

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async disableClaim(@Args('id') id: string, @CurrentUser() user: User) {
    const claim = await this.claimsService.findOne(id);

    await this.claimsService.update(id, {
      id,
      disabled: true,
    });
    await this.claimsService.softDelete(id);

    this.claimsService.notifyFollowers({
      id,
      subject: 'A claim you follow has been disabled',
      html: `
        The claim "${claim.title}" you follow has been disabled by <b>${user.username}</b> due to off topic reasons
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyOwner({
      id,
      subject: 'Your claim has been disabled',
      html: `
        Your claim "${claim.title}" has been disabled by <b>${user.username}</b> due to off topic reasons
      `,
      triggeredBy: user,
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async reenableClaim(@Args('id') id: string, @CurrentUser() user: User) {
    await this.claimsService.reenable(id);

    const claim = await this.claimsService.findOne(id);

    this.claimsService.notifyFollowers({
      id,
      subject: 'A claim you follow has been re-enabled',
      html: `
        The claim <a href="${getClaimURL(claim.slug)}">${
        claim.title
      }</a> you follow has been re-enabled by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });
    this.claimsService.notifyOwner({
      id,
      subject: 'Your claim has been re-enabled',
      html: `
        Your claim <a href="${getClaimURL(claim.slug)}">${
        claim.title
      }</a> has been re-enabled by <b>${user.username}</b>
      `,
      triggeredBy: user,
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async addFollowerToClaim(@Args('id') id: string, @CurrentUser() user: User) {
    const claim = await this.claimsService.findOne({
      where: { id },
      relations: ['followers'],
    });

    this.claimsService.save({
      ...claim,
      followers: [...(claim.followers || []), user],
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async removeFollowerFromClaim(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { id },
      relations: ['followers'],
    });

    this.claimsService.save({
      ...claim,
      followers: claim.followers.map(({ id }) => id !== user.id),
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async requestClaimOwnership(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ) {
    const claim = await this.claimsService.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!claim) {
      throw new Error('Claim not found');
    } else if (claim.user.username !== process.env.FRACTALFLOWS_BOT_USERNAME) {
      throw new Error(`This claim is already owned by ${claim.user.username}`);
    } else if (!user.twitter) {
      throw new Error(
        'You must first connect your Twitter account to request ownership over this claim',
      );
    } else if (claim.tweetOwner !== user.twitter) {
      throw new Error(
        `Only the original tweet owner, @${claim.tweetOwner}, can request ownership over this claim`,
      );
    } else {
      await this.claimsService.save({
        id: claim.id,
        user,
        ownershipRequestedAt: new Date(),
      });
    }

    return true;
  }
}
