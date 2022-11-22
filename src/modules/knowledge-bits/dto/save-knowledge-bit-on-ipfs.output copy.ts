import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SaveKnowledgeBitOnIPFSOutput {
  @Field(() => String)
  metadataURI: string;

  @Field(() => String)
  fileURI: string;
}
