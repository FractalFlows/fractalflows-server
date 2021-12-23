import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
