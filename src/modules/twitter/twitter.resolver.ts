import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SessionGuard } from '../auth/auth.guard';
import { TwitterService } from './twitter.service';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver()
export class TwitterResolver {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async requestTwitterOAuthUrl(
    @Args('callbackUrl') callbackUrl: string,
    @Context() context,
  ) {
    const authLink = await this.twitterService.requestOAuthUrl({ callbackUrl });

    if (context.req.session) {
      context.req.session.twitter = {
        oauthTokenSecret: authLink.oauth_token_secret,
      };
    }

    return authLink.url;
  }

  @Mutation(() => String)
  @UseGuards(SessionGuard)
  async validateTwitterOAuth(
    @Args('oauthToken') oauthToken: string,
    @Args('oauthVerifier') oauthVerifier: string,
    @Context() context,
    @CurrentUser() user: User,
  ) {
    const { oauthTokenSecret } = context.req.session.twitter;

    if (!oauthToken || !oauthVerifier || !oauthTokenSecret) {
      throw new Error('You denied the app or your session expired!');
    }

    const twitterUser = await this.twitterService.validateOAuth({
      oauthToken,
      oauthVerifier,
      oauthTokenSecret,
    });
    const twitterUsername = twitterUser.screen_name;

    const twitterAlreadyInUse = await this.usersService.findOne({
      where: { twitter: twitterUsername },
    });

    if (twitterAlreadyInUse) {
      throw new Error(
        'This Twitter account is already connected to a different user',
      );
    }

    await this.usersService.save({
      id: user.id,
      twitter: twitterUsername,
    });

    if (context.req.session) {
      context.req.session.user = {
        ...context.req.session.user,
        twitter: twitterUsername,
      };
    }

    return twitterUsername;
  }
}
