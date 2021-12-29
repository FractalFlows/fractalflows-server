import { Injectable } from '@nestjs/common';
import { CreateSourceInput } from './dto/create-source.input';
import { UpdateSourceInput } from './dto/update-source.input';

@Injectable()
export class SourcesService {
  create(createSourceInput: CreateSourceInput) {
    return 'This action adds a new source';
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
