import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Claim } from 'src/modules/claims/entities/claim.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

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
  @OneToMany(() => Claim, (claim) => claim.createdBy)
  claims: Claim[];
}
