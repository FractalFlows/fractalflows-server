import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ClaimsModule } from '../claims/claims.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { TwitterResolver } from './twitter.resolver';
import { TwitterService } from './twitter.service';

@Module({
  exports: [TwitterService],
  providers: [TwitterResolver, TwitterService],
  imports: [ClaimsModule, UsersModule, SourcesModule, TagsModule, HttpModule],
})
export class TwitterModule {
  constructor(private readonly twitterService: TwitterService) {}

  configure() {
    // this.twitterService.startStream();
  }
}
