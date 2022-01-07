import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateArgumentCommentInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
