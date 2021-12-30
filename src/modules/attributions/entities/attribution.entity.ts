import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';

@Entity()
@ObjectType()
export class Attribution extends BaseEntity {
  @Field(() => String, { description: 'Origin' })
  @Column()
  origin: string;

  @Field(() => String, { description: 'Claimant identifier' })
  @Column()
  identifier: string;

  @Field(() => Claim, { description: 'Claim' })
  @ManyToOne(() => Claim, (claim) => claim.attributions)
  claim: Claim;
}
