import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ArgumentCommentsService } from './argument-comments.service';
import { ArgumentComment } from './entities/argument-comment.entity';
import { CreateArgumentCommentInput } from './dto/create-argument-comment.input';
import { UpdateArgumentCommentInput } from './dto/update-argument-comment.input';
import { SessionGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IPFS } from 'src/common/services/ipfs';
import { ArgumentCommentInput } from './dto/argument-comment.input';
import { ClaimsService } from '../claims/claims.service';
import { ArgumentsService } from '../arguments/arguments.service';

@Resolver(() => ArgumentComment)
export class ArgumentCommentsResolver {
  constructor(
    private readonly argumentCommentsService: ArgumentCommentsService,
    private readonly argumentsService: ArgumentsService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async saveArgumentCommentOnIPFS(
    @Args('saveArgumentCommentOnIPFSInput')
    argumentComment: ArgumentCommentInput,
  ) {
    const metadataURI = await IPFS.uploadArgumentCommentMetadata(
      argumentComment,
    );
    return metadataURI;
  }

  @Mutation(() => ArgumentComment)
  @UseGuards(SessionGuard)
  async createArgumentComment(
    @Args('createArgumentCommentInput', {
      type: () => CreateArgumentCommentInput,
    })
    createArgumentCommentInput: CreateArgumentCommentInput,
    @CurrentUser() user: User,
  ) {
    const argumentComment = await this.argumentCommentsService.save({
      ...createArgumentCommentInput,
      user,
    });
    const argument = await this.argumentsService.findOne({
      where: { id: argumentComment.argument.id },
      relations: ['claim'],
    });
    this.claimsService.save({
      id: argument.claim.id,
      updatedAt: new Date(),
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
