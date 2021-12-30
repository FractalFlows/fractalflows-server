import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@ObjectType()
export class Tag extends BaseEntity {
  @Field(() => String, { description: 'Label' })
  @Column()
  label: string;
}
