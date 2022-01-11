import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';

import { Claim } from 'src/modules/claims/entities/claim.entity';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { KnowledgeBitVote } from 'src/modules/knowledge-bit-votes/entities/knowledge-bit-vote.entity';

export enum UsernameSource {
  ENS,
  CUSTOM,
}

registerEnumType(UsernameSource, {
  name: 'UsernameSource',
});

export enum AvatarSource {
  ENS,
  GRAVATAR,
}

registerEnumType(AvatarSource, {
  name: 'AvatarSource',
});

export enum UserRole {
  NORMAL,
  ADMIN,
  VALIDATOR,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => String, {
    description: 'Ethereum wallet address',
    nullable: true,
  })
  @Column({ nullable: true })
  ethAddress?: string;

  @Field(() => String, { description: 'Email', nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field(() => String)
  @Column()
  username?: string;

  @Field(() => UsernameSource, {
    description: 'Username source',
    nullable: true,
  })
  @Column({ nullable: true })
  usernameSource?: UsernameSource;

  @Field(() => String, {
    description: 'Avatar',
    nullable: true,
  })
  @Column({ nullable: true })
  avatar?: string;

  @Field(() => AvatarSource, {
    description: 'Avatar source',
    nullable: true,
  })
  @Column({ nullable: true })
  avatarSource?: AvatarSource;

  @Column({ nullable: true })
  magicLinkHash?: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role?: UserRole;

  @Field(() => String, { description: 'API Key', nullable: true })
  @Column({ nullable: true })
  apiKey?: string;

  @Field(() => String, { description: 'API Secret', nullable: true })
  @Column({ nullable: true })
  apiSecret?: string;

  @Field(() => [Claim], { description: 'User claims', nullable: true })
  @OneToMany(() => Claim, (claim) => claim.user)
  claims: Claim[];

  @Field(() => [KnowledgeBit], { nullable: true })
  @OneToMany(() => KnowledgeBit, (knowledgeBit) => knowledgeBit.user)
  knowledgeBits: KnowledgeBit[];

  @Field(() => [KnowledgeBitVote], { nullable: true })
  @OneToMany(() => KnowledgeBitVote, (vote) => vote.user)
  knowledgeBitVotes: KnowledgeBitVote[];
}
