import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';

import { SignInWithEthereumInput } from './dto/signin.input';
import { InfuraService } from 'src/common/services/infura';
import { sendMail } from 'src/common/services/mail';

@Injectable()
export class AuthService {
  getNonce(): string {
    return generateNonce();
  }

  async signInWithEthereum(
    signInWithEthereumInput: SignInWithEthereumInput,
    nonce: string,
  ) {
    const siweMessage = new SiweMessage(
      signInWithEthereumInput.siweMessage as SiweMessage,
    );

    const infuraProvider = InfuraService.getProvider(siweMessage.chainId);
    await infuraProvider.ready;

    const fields: SiweMessage = await siweMessage.validate(infuraProvider);

    if (fields.nonce !== nonce) {
      throw new Error('Invalid nonce');
    }

    return fields;
  }

  async sendSignInCode({ email, signInCode }) {
    return await sendMail({
      subject: `Your sign in code: ${signInCode}`,
      to: email,
      html: `
        Here is your sign in code. Enter it in your open browser window to sign in: <strong>${signInCode}</strong>
      `,
    });
  }

  async signOut(session) {
    await session.destroy();
    return true;
  }
}
