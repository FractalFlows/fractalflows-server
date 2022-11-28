import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { ArgumentComment } from 'src/modules/argument-comments/entities/argument-comment.entity';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';
import { Opinion } from 'src/modules/opinions/entities/opinion.entity';

export enum ArgumentSides {
  CON,
  PRO,
}

registerEnumType(ArgumentSides, {
  name: 'ArgumentSides',
});

@Entity()
@ObjectType()
export class Argument extends BaseEntity {
  @Field(() => String)
  @Column()
  summary: string;

  @Field(() => [KnowledgeBit], { nullable: true })
  @ManyToMany(() => KnowledgeBit)
  @JoinTable()
  evidences?: KnowledgeBit[];

  @Field(() => ArgumentSides)
  @Column({
    type: 'enum',
    enum: ArgumentSides,
  })
  side: ArgumentSides;

  @Field(() => [ArgumentComment], { nullable: true })
  @OneToMany(
    () => ArgumentComment,
    (argumentComment) => argumentComment.argument,
  )
  comments?: ArgumentComment[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.claims)
  user: User;

  @Field(() => Claim)
  @ManyToOne(() => Claim, (claim) => claim.arguments)
  claim: Claim;

  @Field(() => [Opinion], { nullable: true })
  @ManyToMany(() => Opinion, (opinion) => opinion.arguments)
  opinions: Opinion[];

  @Field(() => String)
  @Column()
  nftTxHash?: string;

  @Field(() => String)
  @Column()
  nftTokenId?: string;

  @Field(() => String)
  @Column()
  nftMetadataURI?: string;
}
