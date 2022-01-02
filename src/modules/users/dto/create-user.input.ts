import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, {
    description: 'Etherem wallet address',
    nullable: true,
  })
  ethAddress?: string;

  @Field(() => String, {
    description: 'Email',
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    description: 'Magic link hash',
    nullable: true,
  })
  magicLinkHash?: string;
}
