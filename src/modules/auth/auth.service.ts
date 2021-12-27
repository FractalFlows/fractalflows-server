import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';

import { SignInInput } from './dto/signin.input';
import { InfuraService } from 'src/common/services/infura';

@Injectable()
export class AuthService {
  getNonce(): string {
    return generateNonce();
  }

  async signIn(signInInput: SignInInput, session) {
    try {
      const siweMessage = new SiweMessage(
        signInInput.siweMessage as SiweMessage,
      );

      const infuraProvider = InfuraService.getProvider(siweMessage.chainId);
      await infuraProvider.ready;

      const fields: SiweMessage = await siweMessage.validate(infuraProvider);

      if (fields.nonce !== session.nonce) {
        throw new Error('Invalid nonce');
      }

      session.siwe = fields;
      session.ens = signInInput.ens;
      session.avatar = signInInput.avatar;
      session.nonce = null;
      session.cookie.expires = new Date(fields.expirationTime);

      return true;
    } catch (e) {
      session.siwe = null;
      session.nonce = null;
      session.ens = null;

      throw new Error(e.message);
    }
  }

  async signOut(session) {
    await session.destroy();
    return true;
  }
}
