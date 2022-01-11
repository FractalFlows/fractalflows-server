import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateClaimInput } from './create-claim.input';

@InputType()
export class UpdateClaimInput extends PartialType(CreateClaimInput) {
  @Field(() => String)
  id: string;

  disabled?: boolean;
}
