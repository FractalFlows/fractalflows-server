import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { name: 'nonce' })
  getNonce(@Context() context) {
    const nonce = this.authService.getNonce();
    context.req.session.nonce = nonce;
    return nonce;
  }

  @Query(() => String, { name: 'testNonce' })
  testNonce(@Context() context) {
    console.log('test nonce', context.req.session);
    return context.req.session.nonce;
  }

  @Mutation(() => Boolean)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context() context,
  ) {
    return await this.authService.signIn(signInInput, context.req.session);
  }
}
