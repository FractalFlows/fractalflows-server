import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSourceInput {
  @Field(() => String)
  origin: string;

  @Field(() => String)
  url: string;
}
