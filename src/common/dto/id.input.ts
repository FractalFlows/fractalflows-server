import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class IDInput {
  @Field(() => String)
  id: string;
}
