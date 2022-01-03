import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => String)
  username: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  ethAddress?: string;
}
