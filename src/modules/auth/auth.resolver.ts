import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
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

  @Query(() => Session, { name: 'session', nullable: true })
  getSession(@Context() context) {
    return {
      siweMessage: context.req.session.siwe,
      ens: context.req.session.ens,
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
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}
