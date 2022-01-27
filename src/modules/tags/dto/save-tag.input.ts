import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SaveTagInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { description: 'Label' })
  label: string;
}
