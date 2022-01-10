import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Search {
  @Field(() => Int)
  totalCount: number;
}
