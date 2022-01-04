import { InputType, Field } from '@nestjs/graphql';

import { CreateClaimInput } from './create-claim.input';

@InputType()
export class UpdateClaimInput extends CreateClaimInput {
  @Field(() => String)
  id: string;
}
