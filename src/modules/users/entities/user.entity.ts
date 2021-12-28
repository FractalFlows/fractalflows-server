import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
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
}
