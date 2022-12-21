import { InputType, Field, Float } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

// @InputType()
// class SaveOpinionClaimInput {
//   @Field(() => String)
//   id: string;
// }

@InputType()
export class SaveOpinionInput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => Float)
  acceptance: number;

  @Field(() => [IDInput])
  arguments: IDInput[];

  @Field(() => IDInput)
  claim: IDInput;

  @Field(() => String)
  nftTokenId: string;

  @Field(() => String, { nullable: true })
  nftTxHash: string;

  @Field(() => String, { nullable: true })
  nftMetadataURI: string;
}
