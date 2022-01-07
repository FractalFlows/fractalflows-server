import { CreateArgumentInput } from './create-argument.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArgumentInput extends PartialType(CreateArgumentInput) {
  @Field(() => Int)
  id: number;
}
