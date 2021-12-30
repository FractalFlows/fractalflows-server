import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { ClaimsService } from './claims.service';
import { Claim } from './entities/claim.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { SourcesService } from '../sources/sources.service';
import { AttributionsService } from '../attributions/attributions.service';
import { TagsService } from '../tags/tags.service';
import { Source } from '../sources/entities/source.entity';

@Resolver(() => Claim)
export class ClaimsResolver {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
    private readonly attributionsService: AttributionsService,
  ) {}

  @Mutation(() => Claim)
  async createClaim(
    @Args('createClaimInput') createClaimInput: CreateClaimInput,
  ) {
    await this.sourcesService.createMany(createClaimInput.sources);
    await this.attributionsService.createMany(createClaimInput.attributions);
    await this.tagsService.createMany(createClaimInput.tags);

    return await this.claimsService.create(createClaimInput);
  }

  @Query(() => [Claim], { name: 'claims' })
  findAll() {
    return this.claimsService.findAll();
  }

  @Query(() => Claim, { name: 'claim' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.claimsService.findOne(id);
  }

  @Mutation(() => Claim)
  updateClaim(@Args('updateClaimInput') updateClaimInput: UpdateClaimInput) {
    return this.claimsService.update(updateClaimInput.id, updateClaimInput);
  }

  @Mutation(() => Claim)
  removeClaim(@Args('id', { type: () => Int }) id: number) {
    return this.claimsService.remove(id);
  }
}
