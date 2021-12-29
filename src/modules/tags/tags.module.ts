import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsResolver, TagsService],
})
export class TagsModule {}
