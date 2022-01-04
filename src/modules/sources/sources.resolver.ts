import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { SourcesService } from './sources.service';
import { Source } from './entities/source.entity';

@Resolver(() => Source)
export class SourcesResolver {
  constructor(private readonly sourcesService: SourcesService) {}

  @Query(() => [Source], { name: 'sources' })
  findAll() {
    return this.sourcesService.findAll();
  }

  @Query(() => Source, { name: 'source' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sourcesService.findOne(id);
  }

  @Mutation(() => Source)
  removeSource(@Args('id', { type: () => Int }) id: number) {
    return this.sourcesService.remove(id);
  }
}
