import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaveAttributionInput } from './dto/save-attribution.input';
import { Attribution } from './entities/attribution.entity';

@Injectable()
export class AttributionsService {
  constructor(
    @InjectRepository(Attribution)
    private attributionsRepository: Repository<Attribution>,
  ) {}

  async save(saveAttributionInput: SaveAttributionInput[]) {
    return await this.attributionsRepository.save(saveAttributionInput || []);
  }

  findAll() {
    return `This action returns all attributions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribution`;
  }
}
