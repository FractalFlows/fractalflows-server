import { InputType, Field } from '@nestjs/graphql';
import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';

import {
  KnowledgeBitLocation,
  KnowledgeBitType,
} from '../entities/knowledge-bit.entity';

@InputType()
export class CreateKnowledgeBitInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  summary?: string;

  @Field(() => KnowledgeBitType)
  type: KnowledgeBitType;

  @Field(() => String, { nullable: true })
  customType?: string;

  @Field(() => KnowledgeBitLocation)
  location?: KnowledgeBitLocation;

  @Field(() => String, { nullable: true })
  customLocation?: string;

  @Field(() => String)
  url: string;

  @Field(() => [SaveAttributionInput], { nullable: true })
  attributions: SaveAttributionInput[];
}
