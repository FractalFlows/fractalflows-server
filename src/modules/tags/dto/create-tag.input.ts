import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTagInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { description: 'Label' })
  label: string;
}
