import { InputType, Field } from '@nestjs/graphql';
import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';

import {
  KnowledgeBitLocations,
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

  @Field(() => KnowledgeBitLocations)
  location: KnowledgeBitLocations;

  @Field(() => String, { nullable: true })
  customLocation?: string;

  @Field(() => String)
  url: string;

  @Field(() => [SaveAttributionInput], { nullable: true })
  attributions: SaveAttributionInput[];
}
