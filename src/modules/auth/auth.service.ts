import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';

import { SignInInput } from './dto/signin.input';
import { InfuraService } from 'src/common/services/infura';

@Injectable()
export class AuthService {
  getNonce(): string {
    return generateNonce();
  }

  async signIn(signInInput: SignInInput, nonce: string) {
    const siweMessage = new SiweMessage(signInInput.siweMessage as SiweMessage);

    const infuraProvider = InfuraService.getProvider(siweMessage.chainId);
    await infuraProvider.ready;

    const fields: SiweMessage = await siweMessage.validate(infuraProvider);

    if (fields.nonce !== nonce) {
      throw new Error('Invalid nonce');
    }

    return fields;
  }

  async signOut(session) {
    await session.destroy();
    return true;
  }
}
