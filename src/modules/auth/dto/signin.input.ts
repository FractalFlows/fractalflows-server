import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SiweMessageInput {
  @Field(() => String, { description: 'ETH address' })
  address: string;

  @Field(() => Number, { description: '' })
  chainId: number;

  @Field(() => String, { description: 'Dapp domain' })
  domain: string;

  @Field(() => String, { description: '' })
  issuedAt: string;

  @Field(() => String, { description: 'Signature unique identifier' })
  nonce: string;

  @Field(() => String, { description: '' })
  statement: string;

  @Field(() => String, { description: 'Dapp URI' })
  uri: string;

  @Field(() => String, { description: '' })
  version: string;
}

@InputType()
export class SignInWithEthereumInput {
  @Field(() => SiweMessageInput, { description: ' ' })
  siweMessage: SiweMessageInput;

  @Field(() => String, { description: 'Message signature' })
  signature: string;

  @Field(() => String, { nullable: true })
  ens?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}
