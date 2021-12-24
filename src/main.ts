import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import FileStore from 'session-file-store';
import path from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const FileStoreStore = FileStore(session);

  const sessionOptions = {
    name: configService.get('SESSION_COOKIE_NAME'),
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    store: new FileStoreStore({
      path: path.resolve(__dirname, './db/sessions'),
    }),
    cookie: {
      httpOnly: true,
      secure: configService.get('NODE_ENV') === 'production',
    },
  };
  app.use(session(sessionOptions));

  await app.listen(3000);
}
bootstrap();
