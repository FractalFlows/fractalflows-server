import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository, ILike } from 'typeorm';

import { SaveTagInput } from './dto/save-tag.input';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async save(saveTagInput: Partial<Tag>[]) {
    const tags = await (saveTagInput || []).reduce(async (accPromise, curr) => {
      const acc = await accPromise;
      const tag = await this.tagsRepository.findOne({
        where: { label: curr.label },
      });

      if (tag) {
        return [...acc, tag];
      }

      let slug;
      let slugIndex = 0;

      do {
        slug = `${slugify(curr.label, {
          lower: true,
          strict: true,
        })}${slugIndex > 0 ? `-${slugIndex}` : ''}`;

        slugIndex++;
      } while (
        (await this.tagsRepository.findOne({ where: { slug } })) !==
          undefined ||
        acc.find((tag) => tag.slug === slug) !== undefined
      );

      return [
        ...acc,
        {
          ...curr,
          slug,
        },
      ];
    }, Promise.resolve([]));

    const upsertedTags = await this.tagsRepository.upsert(tags, ['label']);

    return upsertedTags;
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

  async findOne(query) {
    return this.tagsRepository.findOne(query);
  }
}
