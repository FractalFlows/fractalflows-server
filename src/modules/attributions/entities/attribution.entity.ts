import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Attribution {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Origin' })
  origin: string;

  @Field(() => String, { description: 'Identifier' })
  identifier: string;
}
