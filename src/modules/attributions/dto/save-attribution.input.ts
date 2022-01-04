import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SaveAttributionInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { description: 'Origin' })
  origin: string;

  @Field(() => String, { description: 'Identifier' })
  identifier: string;
}
