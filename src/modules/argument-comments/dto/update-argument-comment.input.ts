import { InputType, Field } from '@nestjs/graphql';

import { CreateArgumentCommentInput } from './create-argument-comment.input';

@InputType()
export class UpdateArgumentCommentInput extends CreateArgumentCommentInput {
  @Field(() => String)
  id: string;
}
