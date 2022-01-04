import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SaveTagInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { description: 'Label' })
  label: string;
}
