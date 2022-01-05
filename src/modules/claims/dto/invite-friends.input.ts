import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class InviteFriendsInput {
  @Field(() => String)
  slug: string;

  @Field(() => [String], { description: "Friends' emails" })
  emails: string[];

  @Field(() => String, { nullable: true })
  message?: string;
}
