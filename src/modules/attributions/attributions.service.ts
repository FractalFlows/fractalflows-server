import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributionInput } from './dto/create-attribution.input';
import { UpdateAttributionInput } from './dto/update-attribution.input';
import { Attribution } from './entities/attribution.entity';

@Injectable()
export class AttributionsService {
  constructor(
    @InjectRepository(Attribution)
    private attributionsRepository: Repository<Attribution>,
  ) {}

  async createMany(createAttributionInput: CreateAttributionInput[]) {
    return await this.attributionsRepository.save(createAttributionInput || []);
  }

  findAll() {
    return `This action returns all attributions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribution`;
  }

  update(id: number, updateAttributionInput: UpdateAttributionInput) {
    return `This action updates a #${id} attribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribution`;
  }
}
