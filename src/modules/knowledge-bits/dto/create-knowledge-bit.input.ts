import { InputType, Field } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/common/interfaces';

import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';
import {
  KnowledgeBitSides,
  KnowledgeBitTypes,
} from '../entities/knowledge-bit.entity';

@InputType()
export class CreateKnowledgeBitInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  summary?: string;

  @Field(() => KnowledgeBitSides)
  side: KnowledgeBitSides;

  @Field(() => KnowledgeBitTypes)
  type: KnowledgeBitTypes;

  @Field(() => String, { nullable: true })
  customType?: string;

  @Field(() => [SaveAttributionInput], { nullable: true })
  attributions: SaveAttributionInput[];

  @Field(() => String)
  fileURI: string;

  @Field(() => String)
  nftTxHash: string;

  @Field(() => String)
  nftTokenId: string;

  @Field(() => String)
  nftMetadataURI: string;
}
