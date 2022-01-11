import { Module } from '@nestjs/common';

import { ClaimsModule } from '../claims/claims.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { TwitterService } from './twitter.service';

@Module({
  exports: [TwitterService],
  providers: [TwitterService],
  imports: [ClaimsModule, UsersModule, SourcesModule, TagsModule],
})
export class TwitterModule {
  constructor(private readonly twitterService: TwitterService) {}

  configure() {
    // this.twitterService.startStream();
    this.twitterService.startStreamV1();
  }
}
