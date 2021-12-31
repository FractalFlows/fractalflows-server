import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class SiweMessage {
  @Field(() => String, { description: 'ETH address' })
  address: string;

  @Field(() => String, { description: '' })
  chainId: string;

  @Field(() => String, { description: 'Dapp domain' })
  domain: string;

  @Field(() => String, { description: '' })
  issuedAt: string;

  @Field(() => String, { description: 'Signature unique identifier' })
  nonce: string;

  @Field(() => String, { description: 'Message signature' })
  signature: string;

  @Field(() => String, { description: '' })
  statement: string;

  @Field(() => String, { description: 'Signature type' })
  type: string;

  @Field(() => String, { description: 'Dapp URI' })
  uri: string;

  @Field(() => String, { description: '' })
  version: string;
}

@ObjectType()
export class Session {
  @Field(() => SiweMessage, { description: 'ETH address' })
  siweMessage: SiweMessage;

  @Field(() => String, { description: 'ENS', nullable: true })
  ens?: string;

  @Field(() => String, { description: 'Avatar', nullable: true })
  avatar?: string;

  @Field(() => User, { description: 'User', nullable: true })
  user: User;
}
