import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SaveClaimOnIPFSOutput {
  @Field(() => String)
  metadataURI: string;

  @Field(() => String)
  ipnsName: string;
}
