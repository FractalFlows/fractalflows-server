import { InputType, Field } from '@nestjs/graphql';
import { IDInput } from 'src/common/dto/id.input';

import { ArgumentSides } from '../entities/argument.entity';

@InputType()
export class CreateArgumentInput {
  @Field(() => String)
  summary: string;

  @Field(() => [IDInput], { nullable: true })
  evidences: IDInput[];

  @Field(() => ArgumentSides)
  side: ArgumentSides;
}
