import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SessionGuard } from './auth.guard';
import { SignInInput } from './dto/signin.input';
import { Session } from './dto/signin.output';
import { UsersService } from '../users/users.service';

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
  getSession(@Context() context) {
    const { siwe, ens, avatar, user } = context.req.session;

    return {
      siweMessage: siwe,
      ens,
      avatar,
      user,
    };
  }

  @Mutation(() => Boolean)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context() context,
  ) {
    const { session } = context.req;

    try {
      const siwe = await this.authService.signIn(signInInput, session.nonce);
      const user = await this.usersService.createIfDoesntExist({
        ethAddress: signInInput.siweMessage.address,
      });

      session.user = user;
      session.siwe = siwe;
      session.ens = signInInput.ens;
      session.avatar = signInInput.avatar;
      session.nonce = null;
      session.cookie.expires = new Date(siwe.expirationTime);
    } catch (e) {
      session.siwe = null;
      session.nonce = null;
      session.ens = null;

      throw new Error(e.message);
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}
