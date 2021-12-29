import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { Source } from 'src/modules/sources/entities/source.entity';
import { Attribution } from 'src/modules/attributions/entities/attribution.entity';

@Entity()
@ObjectType()
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
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

  @Field(() => [Source], { description: 'Sources' })
  @ManyToOne(() => Source)
  sources: Source[];

  @Field(() => [Tag], { description: 'Tags' })
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Field(() => [Attribution], { description: 'Attributions' })
  @ManyToOne(() => Attribution)
  attributions: Attribution[];

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
