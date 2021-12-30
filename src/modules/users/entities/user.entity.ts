import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { Claim } from 'src/modules/claims/entities/claim.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

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

  @Field(() => [Claim], { description: 'User claims', nullable: true })
  @OneToMany(() => Claim, (claim) => claim.user)
  claims: Claim[];
}
