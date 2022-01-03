import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Not } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import crypto from 'crypto';

import { UsersService } from './users.service';
import { AvatarSource, User, UsernameSource } from './entities/user.entity';
import { SessionGuard } from '../auth/auth.guard';
import { getGravatarURL } from 'src/common/utils/gravatar';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  async updateProfile(
    @Args('updateProfileInput', { type: () => UpdateProfileInput })
    updateProfileInput: UpdateProfileInput,
    @Context() context,
  ) {
    const userId = context.req.session.user.id;
    const user = await this.usersService.findOne(userId);
    const getUsername = async () => {
      if (updateProfileInput.usernameSource === UsernameSource.CUSTOM) {
        const isCustomUsernameAlreadyInUse = await this.usersService.findOne({
          where: { username: updateProfileInput.username, id: Not(userId) },
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
      id: userId,
    });

    const userWithUpdatedProfile = await this.usersService.findOne(userId);
    context.req.session.user = userWithUpdatedProfile;

    return userWithUpdatedProfile;
  }

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  async updateEmail(@Args('email') email: string, @Context() context) {
    const userId = context.req.session.user.id;
    const isEmailAddressAlreadyInUse = await this.usersService.findOne({
      where: { email, id: Not(userId) },
    });

    if (isEmailAddressAlreadyInUse) {
      throw new Error('Email address already in use');
    } else {
      const user = await this.usersService.findOne(userId);
      const validatedUpdateEmailInput = {
        id: userId,
        email,
        avatar:
          user.avatarSource === AvatarSource.GRAVATAR
            ? getGravatarURL(email)
            : undefined,
      };
      const userWithUpdatedEmail = await this.usersService.save(
        validatedUpdateEmailInput,
      );
      context.req.session.user = {
        ...context.req.session.user,
        ...validatedUpdateEmailInput,
      };

      return userWithUpdatedEmail;
    }
  }

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  async connectEthereumWallet(
    @Args('address') address: string,
    @Context() context,
  ) {
    const userId = context.req.session.user.id;
    const isEthAddressAlreadyInUse = await this.usersService.findOne({
      where: { ethAddress: address, id: Not(userId) },
    });

    if (isEthAddressAlreadyInUse) {
      throw new Error('Ethereum address already in use');
    } else {
      const user = this.usersService.save({ id: userId, ethAddress: address });
      context.req.session.user.ethAddress = address;
      return user;
    }
  }

  @Query(() => String, { name: 'apiKey', nullable: true })
  @UseGuards(SessionGuard)
  async getAPIKey(@Context() context) {
    const user = await this.usersService.findOne(context.req.session.user.id);
    return user.apiKey;
  }

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async generateAPIKey(@Context() context) {
    const apiKey = crypto.randomBytes(24).toString('hex');

    await this.usersService.save({
      id: context.req.session.user.id,
      apiKey,
    });

    return apiKey;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async removeAPIKey(@Context() context) {
    await this.usersService.save({
      id: context.req.session.user.id,
      apiKey: null,
    });

    return true;
  }
}
