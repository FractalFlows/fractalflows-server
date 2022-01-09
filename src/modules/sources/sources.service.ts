import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveSourceInput } from './dto/save-source.input';
import { Source } from './entities/source.entity';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source) private sourcesRepository: Repository<Source>,
  ) {}

  async save(saveSourceInput: SaveSourceInput[]) {
    return await this.sourcesRepository.save(saveSourceInput || []);
  }

  findAll() {
    return `This action returns all sources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }
}
