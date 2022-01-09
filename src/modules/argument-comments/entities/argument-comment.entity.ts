import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Argument } from 'src/modules/arguments/entities/argument.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
@ObjectType()
export class ArgumentComment extends BaseEntity {
  @Field(() => String)
  @Column()
  content: string;

  @Field(() => Argument)
  @ManyToOne(() => Argument, (argument) => argument.comments)
  argument: Argument;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;
}
