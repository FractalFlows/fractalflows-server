import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'Created at' })
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String, { description: 'Updated at' })
  @UpdateDateColumn()
  updatedAt: string;
}
