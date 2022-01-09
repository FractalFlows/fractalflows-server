import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateArgumentCommentInput } from './dto/create-argument-comment.input';
import { UpdateArgumentCommentInput } from './dto/update-argument-comment.input';
import { ArgumentComment } from './entities/argument-comment.entity';

@Injectable()
export class ArgumentCommentsService {
  constructor(
    @InjectRepository(ArgumentComment)
    private argumentCommentsRepository: Repository<ArgumentComment>,
  ) {}

  async save(
    saveArgumentCommentInput: CreateArgumentCommentInput & {
      id?: string;
      user?: User;
    },
  ) {
    return await this.argumentCommentsRepository.save(saveArgumentCommentInput);
  }

  async findOne(query) {
    return await this.argumentCommentsRepository.findOne(query);
  }

  async softDelete(id: string) {
    return await this.argumentCommentsRepository.softDelete(id);
  }
}
