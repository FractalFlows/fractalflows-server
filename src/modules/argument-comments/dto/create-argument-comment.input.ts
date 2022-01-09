import { InputType, Field } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

@InputType()
export class CreateArgumentCommentInput {
  @Field(() => String)
  content: string;

  @Field(() => IDInput)
  argument: IDInput;
}
