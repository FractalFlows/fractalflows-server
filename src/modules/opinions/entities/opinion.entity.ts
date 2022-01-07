import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Claim } from 'src/modules/claims/entities/claim.entity';
import { Argument } from 'src/modules/arguments/entities/argument.entity';

@Entity()
@ObjectType()
export class Opinion extends BaseEntity {
  @Field(() => Float)
  @Column('float')
  acceptance: number;

  @Field(() => [Argument], { nullable: true })
  @ManyToMany(() => Argument, (argument) => argument.opinions)
  @JoinTable()
  arguments: Argument[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.claims)
  user: User;

  @Field(() => Claim)
  @ManyToOne(() => Claim, (claim) => claim.arguments)
  claim: Claim;
}
