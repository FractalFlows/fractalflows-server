import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { SaveOpinionInput } from './dto/save-opinion.input';
import { Opinion } from './entities/opinion.entity';

@Injectable()
export class OpinionsService {
  constructor(
    @InjectRepository(Opinion) private opinionRepository: Repository<Opinion>,
  ) {}

  async save(createOpinionInput: SaveOpinionInput & { user: User }) {
    return await this.opinionRepository.save(createOpinionInput);
  }

  findAll() {
    return `This action returns all opinions`;
  }

  async findOne(query) {
    return await this.opinionRepository.findOne(query);
  }

  remove(id: number) {
    return `This action removes a #${id} opinion`;
  }
}
