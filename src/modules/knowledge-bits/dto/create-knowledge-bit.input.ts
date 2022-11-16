import { InputType, Field } from '@nestjs/graphql';
import { default as GraphQLUpload } from 'graphql-upload/GraphQLUpload.js';
import { Stream } from 'stream';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

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

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;

  @Field(() => [SaveAttributionInput], { nullable: true })
  attributions: SaveAttributionInput[];
}
