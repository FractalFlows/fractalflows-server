import { ObjectType, Field, Int } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Attribution } from 'src/modules/attributions/entities/attribution.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { KnowledgeBitVote } from 'src/modules/knowledge-bit-votes/entities/knowledge-bit-vote.entity';

export enum KnowledgeBitTypes {
  PUBLICATION_OR_ARTICLE_OR_REPORT,
  SIMULATION_RESULTS,
  EXPERIMENTAL_RESULTS,
  DETAILED_ANALYSIS,
  DATA_SET,
  DETAILED_MATHEMATICAL_FORMULATION,
  SCRIPTS,
  SOURCE_CODE,
  REVIEWS,
  REPRODUCTION_OF_RESULTS,
  STATEMENT_OF_ASSUMPTIONS,
  STATEMENT_OF_HYPOTHESIS,
  DESCRIPTION_OF_METHODOLOGIES,
  OTHER,
}

registerEnumType(KnowledgeBitTypes, {
  name: 'KnowledgeBitTypes',
});

export enum KnowledgeBitSides {
  REFUTING,
  SUPPORTING,
}

registerEnumType(KnowledgeBitSides, {
  name: 'KnowledgeBitSides',
});

@Entity()
@ObjectType()
export class KnowledgeBit extends BaseEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  summary?: string;

  @Field(() => KnowledgeBitSides)
  @Column({
    type: 'enum',
    enum: KnowledgeBitSides,
  })
  side: KnowledgeBitSides;

  @Field(() => KnowledgeBitTypes)
  @Column({
    type: 'enum',
    enum: KnowledgeBitTypes,
  })
  type: KnowledgeBitTypes;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customType?: string;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => [Attribution], { nullable: true })
  @ManyToMany(() => Attribution, (attribution) => attribution.knowledgeBits)
  @JoinTable()
  attributions: Attribution[];

  @Field(() => Claim)
  @ManyToOne(() => Claim, (claim) => claim.knowledgeBits)
  claim: Claim;

  @Field(() => [KnowledgeBitVote], { nullable: true })
  @OneToMany(() => KnowledgeBitVote, (vote) => vote.knowledgeBit)
  votes: KnowledgeBitVote[];

  @Field(() => Int, { nullable: true })
  upvotesCount?: number;

  @Field(() => Int, { nullable: true })
  downvotesCount: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.claims)
  user: User;
}
