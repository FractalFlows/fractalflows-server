import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';

@Entity()
@ObjectType()
export class Attribution extends BaseEntity {
  @Field(() => String, { description: 'Origin' })
  @Column()
  origin: string;

  @Field(() => String, { description: 'Claimant identifier' })
  @Column({ unique: true })
  identifier: string;

  @Field(() => [Claim])
  @ManyToMany(() => Claim, (claim) => claim.attributions)
  claims: Claim[];

  @Field(() => [KnowledgeBit])
  @ManyToMany(() => KnowledgeBit, (knowledgeBit) => knowledgeBit.attributions)
  knowledgeBits: KnowledgeBit[];
}
