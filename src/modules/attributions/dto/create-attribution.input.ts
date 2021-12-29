import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAttributionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
