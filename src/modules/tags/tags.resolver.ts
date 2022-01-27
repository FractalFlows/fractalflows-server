import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}
  @Query(() => [Tag], { name: 'searchTags' })
  search(@Args('term', { nullable: true }) term?: string) {
    return this.tagsService.search(term);
  }

  @Query(() => Tag, { name: 'tag' })
  async findOne(@Args('slug') slug: string) {
    return await this.tagsService.findOne({ where: { slug } });
  }
}
