import { InputType, Field } from '@nestjs/graphql';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';

import { ArgumentSides } from '../entities/argument.entity';

@InputType()
class EvidenceInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class CreateArgumentInput {
  @Field(() => String)
  summary: string;

  @Field(() => [EvidenceInput])
  evidences: EvidenceInput[];

  @Field(() => ArgumentSides)
  side: ArgumentSides;
}
