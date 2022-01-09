import { InputType, Field, Float } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

@InputType()
class ClaimInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class SaveOpinionInput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => Float)
  acceptance: number;

  @Field(() => [IDInput])
  arguments: IDInput[];

  @Field(() => ClaimInput)
  claim: ClaimInput;
}
