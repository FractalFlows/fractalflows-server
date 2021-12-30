import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AttributionsService } from './attributions.service';
import { Attribution } from './entities/attribution.entity';

@Resolver(() => Attribution)
export class AttributionsResolver {
  constructor(private readonly attributionsService: AttributionsService) {}

  @Query(() => [Attribution], { name: 'attributions' })
  findAll() {
    return this.attributionsService.findAll();
  }

  @Query(() => Attribution, { name: 'attribution' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.attributionsService.findOne(id);
  }

  @Mutation(() => Attribution)
  removeAttribution(@Args('id', { type: () => Int }) id: number) {
    return this.attributionsService.remove(id);
  }
}
