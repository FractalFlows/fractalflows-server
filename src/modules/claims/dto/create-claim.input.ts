import { InputType, Field } from '@nestjs/graphql';

import { ClaimOrigins } from '../entities/claim.entity';
import { ClaimInput } from './claim.input';

@InputType()
export class CreateClaimInput extends ClaimInput {
  @Field(() => String)
  nftTokenId: string;

  @Field(() => String)
  nftTxHash: string;

  @Field(() => String)
  nftFractionalizationContractAddress: string;

  @Field(() => String)
  nftMetadataURI: string;

  tweetId?: string;
  tweetOwner?: string;
  origin?: ClaimOrigins;
}
