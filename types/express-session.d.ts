import 'express-session';

declare module 'express-session' {
  interface SessionData {
    siwe: SiweMessage;
    nonce: string;
    ens: string;
  }
}
