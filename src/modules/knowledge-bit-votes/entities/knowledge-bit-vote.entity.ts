import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { KnowledgeBit } from 'src/modules/knowledge-bits/entities/knowledge-bit.entity';
import { User } from 'src/modules/users/entities/user.entity';

export enum KnowledgeBitVoteTypes {
  UPVOTE,
  DOWNVOTE,
}

registerEnumType(KnowledgeBitVoteTypes, {
  name: 'KnowledgeBitVoteTypes',
});

@Entity()
@ObjectType()
export class KnowledgeBitVote extends BaseEntity {
  @Field(() => KnowledgeBitVoteTypes)
  @Column({
    type: 'enum',
    enum: KnowledgeBitVoteTypes,
  })
  type: KnowledgeBitVoteTypes;

  @Field(() => KnowledgeBit)
  @ManyToOne(() => KnowledgeBit, (knowledgeBit) => knowledgeBit.votes)
  knowledgeBit: KnowledgeBit;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.knowledgeBitVotes)
  user: User;
}
