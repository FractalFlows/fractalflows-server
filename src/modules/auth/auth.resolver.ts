import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import crypto from 'crypto';

import { AuthService } from './auth.service';
import { SessionGuard } from './auth.guard';
import { SignInWithEthereumInput } from './dto/signin.input';
import { Session } from './dto/signin.output';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

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

  @Mutation(() => User)
  async signInWithEthereum(
    @Args('signInWithEthereumInput')
    signInWithEthereumInput: SignInWithEthereumInput,
    @Context() context,
  ) {
    const { session } = context.req;

    try {
      const siwe = await this.authService.signInWithEthereum(
        signInWithEthereumInput,
        session.nonce,
      );
      const user = await this.usersService.createIfDoesntExist({
        ethAddress: signInWithEthereumInput.siweMessage.address,
      });

      session.user = user;
      session.siwe = siwe;
      session.ens = signInWithEthereumInput.ens;
      session.avatar = signInWithEthereumInput.avatar;
      session.nonce = null;

      return user;
    } catch (e) {
      session.siwe = null;
      session.nonce = null;
      session.ens = null;

      throw new Error(e.message);
    }
  }

  @Mutation(() => Boolean)
  async sendMagicLink(@Args('email') email: string) {
    const hash = crypto.randomBytes(36).toString('hex');

    await this.authService.sendMagicLink({
      email,
      hash,
    });

    const user = await this.usersService.findOne({
      where: { email },
    });
    await this.usersService.createIfDoesntExist({
      ...(user ? { id: user.id } : { email }),
      magicLinkHash: hash,
    });

    return true;
  }

  @Mutation(() => User)
  async verifyMagicLink(@Args('hash') hash: string, @Context() context) {
    const user = await this.usersService.findOne({
      where: { magicLinkHash: hash },
    });

    if (user) {
      context.req.session.user = user;

      this.usersService.save({
        id: user.id,
        magicLinkHash: null,
      });

      return user;
    } else {
      throw new Error('Invalid magic link');
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}
