import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAttributionInput {
  @Field(() => String, { description: 'Origin' })
  origin: string;

  @Field(() => String, { description: 'Identifier' })
  identifier: string;
}
