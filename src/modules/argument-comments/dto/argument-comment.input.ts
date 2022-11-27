import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class ArgumentCommentInput {
  @Field(() => String)
  content: string;
}
