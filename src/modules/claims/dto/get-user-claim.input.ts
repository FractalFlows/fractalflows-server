import { registerEnumType } from '@nestjs/graphql';

export enum UserClaimRelation {
  OWN,
  CONTRIBUTED,
  FOLLOWING,
}

registerEnumType(UserClaimRelation, {
  name: 'UserClaimRelation',
});
