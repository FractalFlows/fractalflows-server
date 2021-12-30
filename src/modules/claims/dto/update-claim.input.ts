import { CreateClaimInput } from './create-claim.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClaimInput extends PartialType(CreateClaimInput) {
  @Field(() => Int)
  id: number;
}
