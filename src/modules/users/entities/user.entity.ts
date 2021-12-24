import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  @Column()
  ethAddress: string;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  @Column()
  exampleField: string;
}
