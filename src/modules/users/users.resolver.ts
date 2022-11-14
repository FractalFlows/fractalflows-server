import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Not } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import crypto from 'crypto';

import { UsersService } from './users.service';
import { AvatarSource, User, UsernameSource } from './entities/user.entity';
import { SessionGuard } from '../auth/auth.guard';
import { getGravatarURL } from 'src/common/utils/gravatar';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Profile } from './dto/profile.output';
import { hash } from 'src/common/utils/hashing';
import { APIKey } from './dto/api-key.output';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  async updateProfile(
    @Args('updateProfileInput', { type: () => UpdateProfileInput })
    updateProfileInput: UpdateProfileInput,
    @CurrentUser() user,
    @Context() context,
  ) {
    const getUsername = async () => {
      if (updateProfileInput.usernameSource === UsernameSource.CUSTOM) {
        const isCustomUsernameAlreadyInUse = await this.usersService.findOne({
          where: { username: updateProfileInput.username, id: Not(user.id) },
        });

        if (isCustomUsernameAlreadyInUse) {
          throw new Error('Username already in use');
        } else {
          return updateProfileInput.username;
        }
      } else {
        return await this.usersService.getENSName(user.ethAddress);
      }
    };

    await this.usersService.save({
      ...updateProfileInput,
      username: await getUsername(),
      avatar:
        updateProfileInput.avatarSource === AvatarSource.GRAVATAR
          ? getGravatarURL(user.email)
          : await this.usersService.getENSAvatarURL(user.ethAddress),
      id: user.id,
    });

    const userWithUpdatedProfile = await this.usersService.findOne(user.id);

    if (context.req.session) {
      context.req.session.user = userWithUpdatedProfile;
    }

    return userWithUpdatedProfile;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async updateEmail(
    @Args('verificationCode') verificationCode: string,
    @CurrentUser() user: User,
    @Context() context,
  ) {
    const { email, verificationCode: expectedVerificationCode } =
      context.req.session.updateEmail || {};

    if (!expectedVerificationCode) {
      throw new Error('Unable to check verification code');
    } else if (expectedVerificationCode !== verificationCode.trim()) {
      throw new Error('Invalid verification code');
    }

    await this.usersService.save({
      id: user.id,
      email,
      avatar:
        user.avatarSource === AvatarSource.GRAVATAR
          ? getGravatarURL(email)
          : undefined,
    });

    const userWithUpdatedEmail = await this.usersService.findOne(user.id);

    if (context.req.session) {
      context.req.session.user = userWithUpdatedEmail;
      context.req.session.updateEmail = undefined;
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async sendUpdateEmailVerificationCode(
    @Args('email') email: string,
    @CurrentUser() user: User,
    @Context() context,
  ) {
    const isEmailAddressAlreadyInUse = await this.usersService.findOne({
      where: { email, id: Not(user.id) },
    });

    if (isEmailAddressAlreadyInUse) {
      throw new Error('Email address already in use');
    } else {
      const verificationCode = new Date().getTime().toString().substring(7);

      this.usersService.sendUpdateEmailVerificationCode({
        email,
        verificationCode,
      });

      if (context.req.session) {
        context.req.session.updateEmail = {
          email,
          verificationCode,
        };
      }

      return true;
    }
  }

  @Query(() => Profile, { name: 'profile', nullable: true })
  async getProfile(@Args('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });

    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  @Query(() => String, { name: 'apiKey', nullable: true })
  @UseGuards(SessionGuard)
  getAPIKey(@CurrentUser() user: User) {
    return user.apiKey;
  }

  @Mutation(() => APIKey)
  @UseGuards(SessionGuard)
  async createAPIKey(@CurrentUser() user: User, @Context() context) {
    const key = crypto.randomBytes(24).toString('hex');
    const secret = crypto.randomBytes(24).toString('hex');

    await this.usersService.save({
      id: user.id,
      apiKey: key,
      apiSecret: await hash(secret),
    });

    if (context.req.session) context.req.session.user.apiKey = key;

    return {
      key,
      secret,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async removeAPIKey(@CurrentUser() user: User, @Context() context) {
    await this.usersService.save({
      id: user.id,
      apiKey: null,
      apiSecret: null,
    });

    if (context.req.session) context.req.session.user.apiKey = null;

    return true;
  }
}
