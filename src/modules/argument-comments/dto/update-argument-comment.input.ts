import { CreateArgumentCommentInput } from './create-argument-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArgumentCommentInput extends PartialType(CreateArgumentCommentInput) {
  @Field(() => Int)
  id: number;
}
