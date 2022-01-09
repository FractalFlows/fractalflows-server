import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import path from 'path';
import sendgrid from '@sendgrid/mail';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const sessionOptions = {
    name: configService.get('SESSION_COOKIE_NAME'),
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    store: new (sessionFileStore(session))({
      path: path.resolve(__dirname, './db/sessions'),
    }),
    cookie: {
      httpOnly: true,
      secure: configService.get('NODE_ENV') === 'production',
    },
  };
  app.use(session(sessionOptions));

  sendgrid.setApiKey(configService.get('SENDGRID_API_KEY'));

  await app.listen(configService.get('PORT'));
}
bootstrap();
