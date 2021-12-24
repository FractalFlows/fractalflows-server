import { Context, Resolver, Query, Mutation } from '@nestjs/graphql';
import session from 'express-session';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { name: 'nonce' })
  async getNonce(@Context() context) {
    const nonce = this.authService.getNonce();
    context.req.session.nonce = nonce;

    return nonce;
  }

  @Query(() => String, { name: 'testNonce' })
  testNonce(@Context() context) {
    console.log('test nonce', context.req.session.nonce);
    return context.req.session.nonce;
  }

  @Mutation(() => String)
  signin() {
    return '123';
  }
}
