import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';
import { providers } from 'ethers';

import { SignInInput } from './dto/signin.input';
import { AuthUtils } from './auth.utils';

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

      const infuraProvider = new providers.JsonRpcProvider(
        {
          allowGzip: true,
          url: `${AuthUtils.getInfuraUrl(siweMessage.chainId)}/${
            process.env.INFURA_PROJECT_ID
          }`,
          headers: {
            Accept: '*/*',
            Origin: `${process.env.HOST}:${process.env.PORT}`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
          },
        },
        Number.parseInt(siweMessage.chainId),
      );

      await infuraProvider.ready;

      const fields: SiweMessage = await siweMessage.validate(infuraProvider);

      if (fields.nonce !== session.nonce) {
        throw new Error('Invalid nonce');
      }

      session.siwe = fields;
      session.ens = signInInput.ens;
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
}
