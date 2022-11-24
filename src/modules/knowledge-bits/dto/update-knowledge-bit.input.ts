import { InputType, Field, OmitType } from '@nestjs/graphql';

import { CreateKnowledgeBitInput } from './create-knowledge-bit.input';

@InputType()
export class UpdateKnowledgeBitInput extends OmitType(CreateKnowledgeBitInput, [
  'nftTokenId',
  'nftTxHash',
  'fileURI',
]) {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  fileURI?: string;
}
