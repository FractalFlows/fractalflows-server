import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Argument } from 'src/modules/arguments/entities/argument.entity';

@Entity()
@ObjectType()
export class ArgumentComment extends BaseEntity {
  @Field(() => Argument)
  @ManyToOne(() => Argument, (argument) => argument.comments)
  argument: Argument;
}
