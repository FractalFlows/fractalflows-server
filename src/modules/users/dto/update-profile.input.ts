import { InputType, Field } from '@nestjs/graphql';
import { AvatarSource, UsernameSource } from '../entities/user.entity';

@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  username?: string;

  @Field(() => UsernameSource)
  usernameSource: UsernameSource;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => AvatarSource)
  avatarSource: AvatarSource;
}
