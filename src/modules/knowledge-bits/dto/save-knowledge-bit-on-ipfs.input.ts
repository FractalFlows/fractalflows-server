import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import {
  KnowledgeBitSides,
  KnowledgeBitTypes,
} from '../entities/knowledge-bit.entity';
import { FileUpload } from 'src/common/interfaces';
import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';

@InputType()
export class SaveKnowledgeBitOnIPFSInput {
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

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;

  @Field(() => [SaveAttributionInput], { nullable: true })
  attributions: SaveAttributionInput[];
}
