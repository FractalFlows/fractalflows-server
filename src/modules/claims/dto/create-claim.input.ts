import { InputType, Field } from '@nestjs/graphql';

import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';
import { SaveSourceInput } from 'src/modules/sources/dto/save-source.input';
import { SaveTagInput } from 'src/modules/tags/dto/save-tag.input';

@InputType()
export class CreateClaimInput {
  @Field(() => String, { description: 'Title' })
  title: string;

  @Field(() => String, { description: 'Summary' })
  summary: string;

  @Field(() => [SaveSourceInput], { description: 'Sources', nullable: true })
  sources?: SaveSourceInput[];

  @Field(() => [SaveTagInput], { description: 'Tags', nullable: true })
  tags?: SaveTagInput[];

  @Field(() => [SaveAttributionInput], {
    description: 'Attributions',
    nullable: true,
  })
  attributions?: SaveAttributionInput[];

  tweet?: string;
  tweetReply?: string;
  ownershipToken?: string;
}
