import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { SaveTagInput } from './dto/save-tag.input';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async save(saveTagInput: SaveTagInput[]) {
    return await this.tagsRepository.save(saveTagInput || []);
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
