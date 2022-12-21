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
        where: {
          ethAddress: signInWithEthereumInput.siweMessage.address,
        },
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
  @UseGuards(SessionGuard)
  async signOut(@Context() context) {
    return await this.authService.signOut(context.req.session);
  }
}
