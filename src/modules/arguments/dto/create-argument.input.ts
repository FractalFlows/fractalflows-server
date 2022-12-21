import { InputType, Field } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

import { ArgumentSides } from '../entities/argument.entity';
import { ArgumentInput } from './argument.input';

@InputType()
export class CreateArgumentInput extends ArgumentInput {
  @Field(() => String)
  summary: string;

  @Field(() => [IDInput], { nullable: true })
  evidences: IDInput[];

  @Field(() => ArgumentSides)
  side: ArgumentSides;

  @Field(() => String)
  nftTokenId: string;

  @Field(() => String)
  nftTxHash: string;

  @Field(() => String)
  nftMetadataURI: string;
}
