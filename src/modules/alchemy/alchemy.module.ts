import { Module } from '@nestjs/common';

import { ClaimsModule } from '../claims/claims.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { AlchemyService } from './alchemy.service';

@Module({
  exports: [AlchemyService],
  providers: [AlchemyService],
  imports: [ClaimsModule, UsersModule, SourcesModule, TagsModule],
})
export class AlchemyModule {
  constructor(private readonly alchemyService: AlchemyService) {}

  configure() {
    this.alchemyService.startNFTMintsStream();
  }
}
