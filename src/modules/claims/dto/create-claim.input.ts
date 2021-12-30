import { InputType, Field } from '@nestjs/graphql';

import { CreateAttributionInput } from 'src/modules/attributions/dto/create-attribution.input';
import { CreateSourceInput } from 'src/modules/sources/dto/create-source.input';
import { CreateTagInput } from 'src/modules/tags/dto/create-tag.input';

@InputType()
export class CreateClaimInput {
  @Field(() => String, { description: 'Title' })
  title: string;

  @Field(() => String, { description: 'Summary' })
  summary: string;

  @Field(() => [CreateSourceInput], { description: 'Sources', nullable: true })
  sources: CreateSourceInput[];

  @Field(() => [CreateTagInput], { description: 'Tags', nullable: true })
  tags: CreateTagInput[];

  @Field(() => [CreateAttributionInput], {
    description: 'Attributions',
    nullable: true,
  })
  attributions: CreateAttributionInput[];
}
