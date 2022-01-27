import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import crypto from 'crypto';

import { AuthService } from './auth.service';
import { SessionGuard } from './auth.guard';
import { SignInWithEthereumInput } from './dto/signin.input';
import { Session } from './dto/signin.output';
import { UsersService } from '../users/users.service';
import {
  AvatarSource,
  User,
  UsernameSource,
} from '../users/entities/user.entity';
import { getGravatarURL } from 'src/common/utils/gravatar';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => String, { name: 'nonce' })
  getNonce(@Context() context) {
    const nonce = this.authService.getNonce();
    context.req.session.nonce = nonce;
    return nonce;
  }

  @Query(() => Session, { name: 'session' })
  @UseGuards(SessionGuard)
  getSession(@CurrentUser() user: User, @Context() context) {
    const { siweMessage } = context.req.session;

    return {
      siweMessage,
      user,
    };
  }

  @Mutation(() => User)
  async signInWithEthereum(
    @Args('signInWithEthereumInput')
    signInWithEthereumInput: SignInWithEthereumInput,
    @Context() context,
  ) {
    const { session } = context.req;

    try {
      const siweMessage = await this.authService.signInWithEthereum(
        signInWithEthereumInput,
        session.nonce,
      );
      const user = await this.usersService.findOne({
        ethAddress: signInWithEthereumInput.siweMessage.address,
      });

      if (user) {
        session.user = user;
      } else {
        const newUser = await this.usersService.create({
          ethAddress: signInWithEthereumInput.siweMessage.address,
          username:
            signInWithEthereumInput.ens ??
            signInWithEthereumInput.siweMessage.address,
          usernameSource: UsernameSource.ENS,
          avatar: signInWithEthereumInput.avatar,
          avatarSource: AvatarSource.ENS,
        });
        session.user = newUser;
      }

      session.siweMessage = siweMessage;
      session.nonce = null;

      return session.user;
    } catch (e) {
      session.siweMessage = null;
      session.nonce = null;

      throw new Error(e.message);
    }
  }

  @Mutation(() => Boolean)
  async sendSignInCode(@Args('email') email: string, @Context() context) {
    const signInCode = new Date().getTime().toString().substring(7);

    await this.authService.sendSignInCode({
      email,
      signInCode,
    });

    const user = await this.usersService.findOne({
      where: { email },
    });

    if (!user) {
      await this.usersService.create({
        email,
        username: email,
        usernameSource: UsernameSource.CUSTOM,
        avatar: getGravatarURL(email),
        avatarSource: AvatarSource.GRAVATAR,
      });
    }

    if (context.req.session) {
      context.req.session.signInWithEmail = {
        email,
        code: signInCode,
      };
    }

    return true;
  }

  @Mutation(() => User)
  async verifySignInCode(
    @Args('signInCode') signInCode: string,
    @Context() context,
  ) {
    const { email, code: expectedSignInCode } =
      context.req.session.signInWithEmail || {};

    if (!expectedSignInCode) {
      throw new Error('Unable to check sign in code');
    } else if (expectedSignInCode !== signInCode.trim()) {
      throw new Error('Invalid sign in code');
    }

    const user = await this.usersService.findOne({
      where: { email },
    });

    if (context.req.session) {
      context.req.session.user = user;
    }

    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}
