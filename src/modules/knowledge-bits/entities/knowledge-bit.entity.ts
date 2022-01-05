import { ObjectType, Field } from '@nestjs/graphql';
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

export enum KnowledgeBitType {
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

registerEnumType(KnowledgeBitType, {
  name: 'KnowledgeBitType',
});

export enum KnowledgeBitLocation {
  EMAIL,
  WEBSITE,
  PDF,
  DATABASE,
  GIT,
  DROPBOX,
  BOX,
  GOOGLE_DRIVE,
  ONEDRIVE,
  STACK_OVERFLOW,
  FIGSHARE,
  SLIDESHARE,
  KAGGLE,
  IPFS,
  DAT,
  JUPYTER,
  BLOG,
  YOUTUBE,
  SCIENTIFIC_PUBLISHER,
  PUBPEER,
  ZENODO,
  OPENAIRE,
  RE3DATA,
  ETHEREUM_SWARM,
  BIT_TORRENT,
  RESEARCH_GATE,
  ACADEMIA_EDU,
  RESEARCH_ID,
  HAL_ARCHIVES,
  ARXIV,
  WIKIPEDIA,
  OTHER,
}

registerEnumType(KnowledgeBitLocation, {
  name: 'KnowledgeBitLocation',
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

  @Field(() => KnowledgeBitType)
  @Column({
    type: 'enum',
    enum: KnowledgeBitType,
  })
  type: KnowledgeBitType;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customType?: string;

  @Field(() => KnowledgeBitLocation)
  @Column({
    type: 'enum',
    enum: KnowledgeBitLocation,
  })
  location?: KnowledgeBitLocation;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customLocation?: string;

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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.claims)
  user: User;
}
