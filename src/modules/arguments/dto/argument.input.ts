import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

import { ArgumentSides } from '../entities/argument.entity';

@InputType()
@ObjectType()
export class ArgumentInput {
  @Field(() => String)
  summary: string;

  @Field(() => ArgumentSides)
  side: ArgumentSides;
}
