import { Field, ObjectType } from '@nestjs/graphql';
import { Search } from 'src/common/dto/search.output';
import { Claim } from '../entities/claim.entity';

@ObjectType()
export class ClaimsSearch extends Search {
  @Field(() => [Claim])
  data: Claim[];
}
