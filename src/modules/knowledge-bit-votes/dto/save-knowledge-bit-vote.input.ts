import { InputType, Field } from '@nestjs/graphql';

import { KnowledgeBitVoteTypes } from '../entities/knowledge-bit-vote.entity';

@InputType()
export class SaveKnowledgeBitVoteInput {
  @Field(() => KnowledgeBitVoteTypes)
  type: KnowledgeBitVoteTypes;

  @Field(() => String)
  knowledgeBitId: string;
}
