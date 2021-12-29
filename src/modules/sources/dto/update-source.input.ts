import { CreateSourceInput } from './create-source.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSourceInput extends PartialType(CreateSourceInput) {
  @Field(() => Int)
  id: number;
}
