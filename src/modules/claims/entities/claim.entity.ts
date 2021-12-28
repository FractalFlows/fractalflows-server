import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';

@Entity()
@ObjectType()
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @Field(() => String, { description: 'Title' })
  @Column()
  title: string;

  @Field(() => String, { description: 'Summary' })
  @Column()
  summary: string;

  @Field(() => String, { description: 'Slug' })
  @Column({ unique: true })
  slug: string;

  @Field(() => String, { description: 'Created at' })
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String, { description: 'Updated at' })
  @UpdateDateColumn()
  updatedAt: string;

  @Field(() => User, { description: 'Created by' })
  @ManyToOne(() => User, (user) => user.claims)
  createdBy: User;
}
