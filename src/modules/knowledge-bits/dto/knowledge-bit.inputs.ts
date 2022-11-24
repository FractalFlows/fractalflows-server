import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  KnowledgeBitSides,
  KnowledgeBitTypes,
} from '../entities/knowledge-bit.entity';
import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';

@InputType()
@ObjectType()
export class KnowledgeBitInput {
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
}
