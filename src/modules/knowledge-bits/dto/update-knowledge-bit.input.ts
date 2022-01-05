import { CreateKnowledgeBitInput } from './create-knowledge-bit.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateKnowledgeBitInput extends PartialType(
  CreateKnowledgeBitInput,
) {
  @Field(() => Int)
  id: number;
}
