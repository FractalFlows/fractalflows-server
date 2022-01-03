import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class APIKey {
  @Field(() => String)
  key: string;

  @Field(() => String, { nullable: true })
  secret?: string;
}
