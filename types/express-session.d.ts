import 'express-session';
import { User } from './modules/users/entities/user.entity';

declare module 'express-session' {
  interface SessionData {
    siweMessage?: SiweMessage;
    user?: User;
    nonce?: string;
  }
}
