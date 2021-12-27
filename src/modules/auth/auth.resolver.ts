import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SessionGuard } from './auth.guard';
import { SignInInput } from './dto/signin.input';
import { Session } from './dto/signin.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { name: 'nonce' })
  getNonce(@Context() context) {
    const nonce = this.authService.getNonce();
    context.req.session.nonce = nonce;
    return nonce;
  }

  @Query(() => Session, { name: 'session' })
  @UseGuards(SessionGuard)
  getSession(@Context() context) {
    return {
      siweMessage: context.req.session.siwe,
      ens: context.req.session.ens,
      avatar: context.req.session.avatar,
    };
  }

  @Mutation(() => Boolean)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context() context,
  ) {
    return await this.authService.signIn(signInInput, context.req.session);
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}