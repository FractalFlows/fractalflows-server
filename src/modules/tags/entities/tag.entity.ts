import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';

@Entity()
@ObjectType()
export class Tag extends BaseEntity {
  @Field(() => String, { description: 'Label' })
  @Column({ unique: true })
  label: string;

  @ManyToMany(() => Claim, (claim) => claim.tags)
  claims: Claim[];
}
