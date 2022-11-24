import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from 'src/common/interfaces';
import { KnowledgeBitInput } from './knowledge-bit.inputs';

@InputType()
export class SaveKnowledgeBitOnIPFSInput extends KnowledgeBitInput {
  @Field(() => GraphQLUpload, { nullable: true })
  file?: Promise<FileUpload>;
}
