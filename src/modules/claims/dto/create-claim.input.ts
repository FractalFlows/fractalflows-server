import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateClaimInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
