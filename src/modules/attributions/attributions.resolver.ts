import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AttributionsService } from './attributions.service';
import { Attribution } from './entities/attribution.entity';
import { CreateAttributionInput } from './dto/create-attribution.input';
import { UpdateAttributionInput } from './dto/update-attribution.input';

@Resolver(() => Attribution)
export class AttributionsResolver {
  constructor(private readonly attributionsService: AttributionsService) {}

  @Mutation(() => Attribution)
  createAttribution(@Args('createAttributionInput') createAttributionInput: CreateAttributionInput) {
    return this.attributionsService.create(createAttributionInput);
  }

  @Query(() => [Attribution], { name: 'attributions' })
  findAll() {
    return this.attributionsService.findAll();
  }

  @Query(() => Attribution, { name: 'attribution' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.attributionsService.findOne(id);
  }

  @Mutation(() => Attribution)
  updateAttribution(@Args('updateAttributionInput') updateAttributionInput: UpdateAttributionInput) {
    return this.attributionsService.update(updateAttributionInput.id, updateAttributionInput);
  }

  @Mutation(() => Attribution)
  removeAttribution(@Args('id', { type: () => Int }) id: number) {
    return this.attributionsService.remove(id);
  }
}
