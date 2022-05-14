import { InputType, Field } from '@nestjs/graphql';

import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';
import { SaveSourceInput } from 'src/modules/sources/dto/save-source.input';
import { SaveTagInput } from 'src/modules/tags/dto/save-tag.input';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { ClaimOrigins } from '../entities/claim.entity';

@InputType()
class ClaimMetadataPropertiesInput {
  @Field(() => [SaveSourceInput], { description: 'Sources', nullable: true })
  sources?: SaveSourceInput[];

  @Field(() => [SaveTagInput], { description: 'Tags', nullable: true })
  tags?: Partial<Tag>[];

  @Field(() => [SaveAttributionInput], {
    description: 'Attributions',
    nullable: true,
  })
  attributions?: SaveAttributionInput[];
}

@InputType()
export class ClaimMetadataInput {
  @Field(() => String, { description: 'Title' })
  name: string;

  @Field(() => String, { description: 'Summary' })
  description: string;

  @Field(() => ClaimMetadataPropertiesInput, {
    description: 'Properties',
    nullable: true,
  })
  properties?: ClaimMetadataPropertiesInput;
}
