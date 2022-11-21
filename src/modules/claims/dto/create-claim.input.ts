import { InputType, Field } from '@nestjs/graphql';

import { SaveAttributionInput } from 'src/modules/attributions/dto/save-attribution.input';
import { SaveSourceInput } from 'src/modules/sources/dto/save-source.input';
import { SaveTagInput } from 'src/modules/tags/dto/save-tag.input';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { ClaimOrigins } from '../entities/claim.entity';

@InputType()
export class CreateClaimInput {
  @Field(() => String, { description: 'Title' })
  title: string;

  @Field(() => String, { description: 'Summary' })
  summary: string;

  @Field(() => [SaveSourceInput], { description: 'Sources', nullable: true })
  sources?: SaveSourceInput[];

  @Field(() => [SaveTagInput], { description: 'Tags', nullable: true })
  tags?: Partial<Tag>[];

  @Field(() => [SaveAttributionInput], {
    description: 'Attributions',
    nullable: true,
  })
  attributions?: SaveAttributionInput[];

  @Field(() => String, { nullable: true })
  nftTokenId: string;
  @Field(() => String, { nullable: true })
  nftTxHash: string;
  @Field(() => String, { nullable: true })
  nftFractionalizationContractAddress: string;
  @Field(() => String, { nullable: true })
  nftMetadataURI: string;
  tweetId?: string;
  tweetOwner?: string;
  origin?: ClaimOrigins;
}
