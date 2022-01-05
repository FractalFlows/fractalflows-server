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

  findOne(id: number) {
    return `This action returns a #${id} knowledgeBit`;
  }

  update(id: number, updateKnowledgeBitInput: UpdateKnowledgeBitInput) {
    return `This action updates a #${id} knowledgeBit`;
  }

  remove(id: number) {
    return `This action removes a #${id} knowledgeBit`;
  }
}
