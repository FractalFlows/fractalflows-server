import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SaveClaimOnIPFSOutput {
  @Field(() => String)
  metadataURI: String;

  @Field(() => String)
  ipnsName: String;
}
