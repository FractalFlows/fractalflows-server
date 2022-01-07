import { Injectable } from '@nestjs/common';
import { CreateArgumentCommentInput } from './dto/create-argument-comment.input';
import { UpdateArgumentCommentInput } from './dto/update-argument-comment.input';

@Injectable()
export class ArgumentCommentsService {
  create(createArgumentCommentInput: CreateArgumentCommentInput) {
    return 'This action adds a new argumentComment';
  }

  findAll() {
    return `This action returns all argumentComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} argumentComment`;
  }

  update(id: number, updateArgumentCommentInput: UpdateArgumentCommentInput) {
    return `This action updates a #${id} argumentComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} argumentComment`;
  }
}
