import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ClaimsService } from './claims.service';
import { Claim } from './entities/claim.entity';
import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';

@Resolver(() => Claim)
export class ClaimsResolver {
  constructor(private readonly claimsService: ClaimsService) {}

  @Mutation(() => Claim)
  createClaim(@Args('createClaimInput') createClaimInput: CreateClaimInput) {
    return this.claimsService.create(createClaimInput);
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
