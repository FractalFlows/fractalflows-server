import { Injectable } from '@nestjs/common';
import { generateNonce } from 'siwe';

@Injectable()
export class AuthService {
  getNonce(): string {
    return generateNonce();
  }
}
