import { InputType, Field } from '@nestjs/graphql';

import { CreateKnowledgeBitInput } from './create-knowledge-bit.input';

@InputType()
export class UpdateKnowledgeBitInput extends CreateKnowledgeBitInput {
  @Field(() => String)
  id: string;
}
