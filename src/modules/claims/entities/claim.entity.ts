import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { Source } from 'src/modules/sources/entities/source.entity';
import { Attribution } from 'src/modules/attributions/entities/attribution.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
@ObjectType()
export class Claim extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  title: string;

  @Field(() => String, { description: 'Summary' })
  @Column()
  summary: string;

  @Field(() => String, { description: 'Slug' })
  @Column({ unique: true })
  slug: string;

  @Field(() => [Source], { description: 'Sources', nullable: true })
  @OneToMany(() => Source, (source) => source.claim)
  sources: Source[];

  @Field(() => [Tag], { description: 'Tags', nullable: true })
  @ManyToMany(() => Tag, (tag) => tag.claims)
  @JoinTable()
  tags: Tag[];

  @Field(() => [Attribution], { description: 'Attributions', nullable: true })
  @OneToMany(() => Attribution, (attribution) => attribution.claim)
  attributions: Attribution[];

  @Field(() => User, { description: 'Created by' })
  @ManyToOne(() => User, (user) => user.claims)
  user: User;
}
