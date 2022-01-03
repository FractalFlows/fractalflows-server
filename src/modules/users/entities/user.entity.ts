import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { Claim } from 'src/modules/claims/entities/claim.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

import { registerEnumType } from '@nestjs/graphql';

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

  @Field(() => String, { description: 'Username', nullable: true })
  @Column({ nullable: true })
  username?: string;

  @Field(() => UsernameSource, {
    description: 'Username source',
    nullable: true,
  })
  @Column({ nullable: true })
  usernameSource: UsernameSource;

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
  avatarSource: AvatarSource;

  @Column({ nullable: true })
  magicLinkHash?: string;

  @Field(() => String, { description: 'API Key', nullable: true })
  @Column({ nullable: true })
  apiKey?: string;

  @Field(() => [Claim], { description: 'User claims', nullable: true })
  @OneToMany(() => Claim, (claim) => claim.user)
  claims: Claim[];
}
