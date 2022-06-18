import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { Source } from 'src/modules/sources/entities/source.entity';
import { Attribution } from 'src/modules/attributions/entities/attribution.entity';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Argument } from 'src/modules/arguments/entities/argument.entity';
import { Opinion } from 'src/modules/opinions/entities/opinion.entity';

export enum ClaimOrigins {
  FRACTALFLOWS,
  TWITTER,
}

registerEnumType(ClaimOrigins, {
  name: 'ClaimOrigins',
});

export enum ClaimNFTStatuses {
  NOTMINTED,
  MINTING,
  MINTED,
}

registerEnumType(ClaimNFTStatuses, {
  name: 'ClaimNFTStatuses',
});

@Entity()
@ObjectType()
export class Claim extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  title: string;

  @Field(() => String, { description: 'Summary' })
  @Column()
  summary: string;

  @Field(() => String, { description: 'Slug' })
  @Column({ unique: true })
  slug: string;

  @Field(() => [Source], { description: 'Sources', nullable: true })
  @OneToMany(() => Source, (source) => source.claim)
  sources: Source[];

  @Field(() => [Tag], { description: 'Tags', nullable: true })
  @ManyToMany(() => Tag, (tag) => tag.claims)
  @JoinTable()
  tags: Tag[];

  @Field(() => [Attribution], { description: 'Attributions', nullable: true })
  @ManyToMany(() => Attribution, (attribution) => attribution.claims)
  @JoinTable()
  attributions: Attribution[];

  @Field(() => [KnowledgeBit], { nullable: true })
  @OneToMany(() => KnowledgeBit, (knowledgeBit) => knowledgeBit.claim)
  knowledgeBits: KnowledgeBit[];

  @Field(() => [Argument], { nullable: true })
  @OneToMany(() => Argument, (argument) => argument.claim)
  arguments: Argument[];

  @Field(() => [Opinion], { nullable: true })
  @OneToMany(() => Opinion, (opinion) => opinion.claim)
  opinions: Opinion[];

  @Field(() => [User], { description: 'Followers', nullable: true })
  @ManyToMany(() => User, (user) => user.followingClaims)
  @JoinTable()
  followers: User[];

  @Field(() => User, { description: 'Created by' })
  @ManyToOne(() => User, (user) => user.claims)
  user: User;

  @Field(() => Float, {
    description: 'Relevance on search listing',
    nullable: true,
  })
  relevance?: number;

  @Field(() => String, {
    description: 'Tweet from which this claim was originated from',
    nullable: true,
  })
  @Column({ nullable: true })
  tweetId?: string;

  @Field(() => String, {
    description: 'Tweet owner from which this claim was originated from',
    nullable: true,
  })
  @Column({ nullable: true })
  tweetOwner?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  disabled?: boolean;

  @Field(() => ClaimOrigins)
  @Column({
    type: 'enum',
    enum: ClaimOrigins,
    default: ClaimOrigins.FRACTALFLOWS,
  })
  origin: ClaimOrigins;

  @Field(() => ClaimNFTStatuses)
  @Column({
    type: 'enum',
    enum: ClaimNFTStatuses,
    default: ClaimNFTStatuses.NOTMINTED,
  })
  nftStatus: ClaimNFTStatuses;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  nftTxId?: string;

  @Field(() => String, {
    nullable: true,
  })
  @Column({ nullable: true })
  nftTokenId?: string;

  @Field(() => String, {
    nullable: true,
  })
  @Column({ nullable: true })
  nftFractionalizationContractAddress?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  ownershipRequestedAt?: Date;
}
