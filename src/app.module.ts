import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      cors: {
        origin: process.env.FRONTEND_CORS_ORIGIN ?? 'http://localhost:3001',
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
