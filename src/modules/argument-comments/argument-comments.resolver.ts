import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArgumentCommentsService } from './argument-comments.service';
import { ArgumentComment } from './entities/argument-comment.entity';
import { CreateArgumentCommentInput } from './dto/create-argument-comment.input';
import { UpdateArgumentCommentInput } from './dto/update-argument-comment.input';

@Resolver(() => ArgumentComment)
export class ArgumentCommentsResolver {
  constructor(
    private readonly argumentCommentsService: ArgumentCommentsService,
  ) {}

  @Mutation(() => ArgumentComment)
  createArgumentComment(
    @Args('createArgumentCommentInput')
    createArgumentCommentInput: CreateArgumentCommentInput,
  ) {
    return this.argumentCommentsService.create(createArgumentCommentInput);
  }

  @Query(() => [ArgumentComment], { name: 'argumentComments' })
  findAll() {
    return this.argumentCommentsService.findAll();
  }

  @Query(() => ArgumentComment, { name: 'argumentComment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.argumentCommentsService.findOne(id);
  }

  @Mutation(() => ArgumentComment)
  updateArgumentComment(
    @Args('updateArgumentCommentInput')
    updateArgumentCommentInput: UpdateArgumentCommentInput,
  ) {
    return this.argumentCommentsService.update(
      updateArgumentCommentInput.id,
      updateArgumentCommentInput,
    );
  }

  @Mutation(() => ArgumentComment)
  removeArgumentComment(@Args('id', { type: () => Int }) id: number) {
    return this.argumentCommentsService.remove(id);
  }
}
