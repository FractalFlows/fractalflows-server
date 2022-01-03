import { InputType, Field } from '@nestjs/graphql';
import { AvatarSource, UsernameSource } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String, {
    description: 'Etherem wallet address',
    nullable: true,
  })
  ethAddress?: string;

  @Field(() => String, {
    description: 'Email',
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    description: 'Magic link hash',
    nullable: true,
  })
  magicLinkHash?: string;

  @Field(() => String)
  username: string;

  @Field(() => UsernameSource)
  usernameSource: UsernameSource;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => AvatarSource)
  avatarSource: AvatarSource;
}
