import { CreateAttributionInput } from './create-attribution.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAttributionInput extends PartialType(CreateAttributionInput) {
  @Field(() => Int)
  id: number;
}
