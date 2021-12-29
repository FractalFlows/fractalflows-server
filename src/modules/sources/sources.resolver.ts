import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SourcesService } from './sources.service';
import { Source } from './entities/source.entity';
import { CreateSourceInput } from './dto/create-source.input';
import { UpdateSourceInput } from './dto/update-source.input';

@Resolver(() => Source)
export class SourcesResolver {
  constructor(private readonly sourcesService: SourcesService) {}

  @Mutation(() => Source)
  createSource(@Args('createSourceInput') createSourceInput: CreateSourceInput) {
    return this.sourcesService.create(createSourceInput);
  }

  @Query(() => [Source], { name: 'sources' })
  findAll() {
    return this.sourcesService.findAll();
  }

  @Query(() => Source, { name: 'source' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sourcesService.findOne(id);
  }

  @Mutation(() => Source)
  updateSource(@Args('updateSourceInput') updateSourceInput: UpdateSourceInput) {
    return this.sourcesService.update(updateSourceInput.id, updateSourceInput);
  }

  @Mutation(() => Source)
  removeSource(@Args('id', { type: () => Int }) id: number) {
    return this.sourcesService.remove(id);
  }
}
