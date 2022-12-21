import { InputType, Field, ObjectType, Float } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class SaveOpinionOnIPFSInput {
  @Field(() => Float)
  acceptance: number;
}
