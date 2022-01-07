import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArgumentInput } from './dto/create-argument.input';
import { UpdateArgumentInput } from './dto/update-argument.input';
import { Argument } from './entities/argument.entity';
import { User } from '../users/entities/user.entity';
import { Claim } from '../claims/entities/claim.entity';

@Injectable()
export class ArgumentsService {
  constructor(
    @InjectRepository(Argument)
    private argumentRepository: Repository<Argument>,
  ) {}

  async create(
    createArgumentInput: CreateArgumentInput & { user: User; claim: Claim },
  ) {
    return await this.argumentRepository.save(createArgumentInput);
  }

  findAll() {
    return `This action returns all arguments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} argument`;
  }

  update(id: number, updateArgumentInput: UpdateArgumentInput) {
    return `This action updates a #${id} argument`;
  }

  remove(id: number) {
    return `This action removes a #${id} argument`;
  }
}
