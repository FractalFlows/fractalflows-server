import { InputType, Field } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

@InputType()
export class CreateArgumentCommentInput {
  @Field(() => String)
  content: string;

  @Field(() => IDInput)
  argument: IDInput;

  @Field(() => String)
  nftIndex: string;

  @Field(() => String)
  nftTxHash: string;

  @Field(() => String)
  nftMetadataURI: string;
}
