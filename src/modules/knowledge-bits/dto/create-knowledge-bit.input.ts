import { InputType, Field } from '@nestjs/graphql';

import { KnowledgeBitInput } from './knowledge-bit.inputs';

@InputType()
export class CreateKnowledgeBitInput extends KnowledgeBitInput {
  @Field(() => String)
  fileURI: string;

  @Field(() => String)
  nftTxHash: string;

  @Field(() => String)
  nftTokenId: string;

  @Field(() => String)
  nftMetadataURI: string;
}
