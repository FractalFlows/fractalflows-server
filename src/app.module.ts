import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { SourcesModule } from './modules/sources/sources.module';
import { TagsModule } from './modules/tags/tags.module';
import { AttributionsModule } from './modules/attributions/attributions.module';
import { AuthAPIKeyMiddleware } from './modules/auth/auth-api-key.middleware';
import { KnowledgeBitsModule } from './modules/knowledge-bits/knowledge-bits.module';
import { KnowledgeBitVotesModule } from './modules/knowledge-bit-votes/knowledge-bit-votes.module';
import { ArgumentsModule } from './modules/arguments/arguments.module';
import { ArgumentCommentsModule } from './modules/argument-comments/argument-comments.module';

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
      context: ({ req }) => ({ req }),
      cors: {
        origin: true,
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    ClaimsModule,
    SourcesModule,
    TagsModule,
    AttributionsModule,
    KnowledgeBitsModule,
    KnowledgeBitVotesModule,
    ArgumentsModule,
    ArgumentCommentsModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAPIKeyMiddleware).forRoutes('*');
  }
}
