import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateKnowledgeBitInput } from './dto/create-knowledge-bit.input';
import { UpdateKnowledgeBitInput } from './dto/update-knowledge-bit.input';
import { KnowledgeBit } from './entities/knowledge-bit.entity';
import { Claim } from '../claims/entities/claim.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class KnowledgeBitsService {
  constructor(
    @InjectRepository(KnowledgeBit)
    private knowledgeBitRepository: Repository<KnowledgeBit>,
  ) {}

  async create(
    createKnowledgeBitInput: CreateKnowledgeBitInput & {
      claim: Claim;
      user: User;
    },
  ) {
    return await this.knowledgeBitRepository.save(createKnowledgeBitInput);
  }

  findAll() {
    return `This action returns all knowledgeBit`;
  }

  async findOne(query) {
    return await this.knowledgeBitRepository.findOne(query);
  }

  async update(id: string, updateKnowledgeBitInput: UpdateKnowledgeBitInput) {
    return await this.knowledgeBitRepository.save({
      ...updateKnowledgeBitInput,
      id,
    });
  }

  async softDelete(id: string) {
    return await this.knowledgeBitRepository.softDelete(id);
  }
}
