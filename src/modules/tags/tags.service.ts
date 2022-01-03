import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { CreateTagInput } from './dto/create-tag.input';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async createMany(createTagsInput: CreateTagInput[]) {
    return await this.tagsRepository.save(createTagsInput || []);
  }

  async search(term?: string) {
    if (term) {
      return await this.tagsRepository.find({
        where: {
          label: ILike(`%${term}%`),
        },
        take: 20,
        skip: 0,
      });
    } else {
      return await this.tagsRepository.find({ take: 20 });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }
}
