import { InputType, Field, Float } from '@nestjs/graphql';
import { Claim } from 'src/modules/claims/entities/claim.entity';

@InputType()
class ArgumentInput {
  @Field(() => String)
  id: string;
}

@InputType()
class ClaimInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class SaveOpinionInput {
  @Field(() => Float)
  acceptance: number;

  @Field(() => [ArgumentInput])
  arguments: ArgumentInput[];

  @Field(() => ClaimInput)
  claim: ClaimInput;
}
