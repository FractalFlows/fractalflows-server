import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ArgumentCommentsService } from './argument-comments.service';
import { ArgumentComment } from './entities/argument-comment.entity';
import { CreateArgumentCommentInput } from './dto/create-argument-comment.input';
import { UpdateArgumentCommentInput } from './dto/update-argument-comment.input';
import { SessionGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => ArgumentComment)
export class ArgumentCommentsResolver {
  constructor(
    private readonly argumentCommentsService: ArgumentCommentsService,
  ) {}

  @Mutation(() => ArgumentComment)
  @UseGuards(SessionGuard)
  async createArgumentComment(
    @Args('createArgumentCommentInput', {
      type: () => CreateArgumentCommentInput,
    })
    createArgumentCommentInput: CreateArgumentCommentInput,
    @CurrentUser() user: User,
  ) {
    const argumentComment = this.argumentCommentsService.save({
      ...createArgumentCommentInput,
      user,
    });
    return argumentComment;
  }

  @Mutation(() => ArgumentComment)
  @UseGuards(SessionGuard)
  async updateArgumentComment(
    @Args('updateArgumentCommentInput')
    updateArgumentCommentInput: UpdateArgumentCommentInput,
  ) {
    const argumentComment = await this.argumentCommentsService.save(
      updateArgumentCommentInput,
    );
    return await this.argumentCommentsService.findOne({
      where: { id: argumentComment.id },
      relations: ['argument', 'user'],
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async deleteArgumentComment(@Args('id') id: string) {
    await this.argumentCommentsService.softDelete(id);
    return true;
  }
}
