import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSourceInput } from './dto/create-source.input';
import { UpdateSourceInput } from './dto/update-source.input';
import { Source } from './entities/source.entity';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source) private sourcesRepository: Repository<Source>,
  ) {}

  async createMany(createSourcesInput: CreateSourceInput[]) {
    return await this.sourcesRepository.save(createSourcesInput || []);
  }

  findAll() {
    return `This action returns all sources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  update(id: number, updateSourceInput: UpdateSourceInput) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }
}
