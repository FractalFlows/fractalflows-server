import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTagInput {
  @Field(() => String, { description: 'Label' })
  label: string;
}
