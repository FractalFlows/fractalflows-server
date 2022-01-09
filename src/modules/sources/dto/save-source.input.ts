import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SaveSourceInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String)
  origin: string;

  @Field(() => String)
  url: string;
}
