import { InputType, Field } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from 'src/common/interfaces';
import { CreateKnowledgeBitInput } from './create-knowledge-bit.input';

@InputType()
export class UpdateKnowledgeBitInput extends CreateKnowledgeBitInput {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLUpload, { nullable: true })
  file: Promise<FileUpload>;
}
