import { Module } from '@nestjs/common';
import { AttributionsModule } from '../attributions/attributions.module';

import { ClaimsModule } from '../claims/claims.module';
import { IPFSModule } from '../ipfs/ipfs.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { AlchemyService } from './alchemy.service';

@Module({
  exports: [AlchemyService],
  providers: [AlchemyService],
  imports: [
    ClaimsModule,
    UsersModule,
    AttributionsModule,
    SourcesModule,
    TagsModule,
    IPFSModule,
  ],
})
export class AlchemyModule {
  constructor(private readonly alchemyService: AlchemyService) {}

  configure() {
    this.alchemyService.startNFTMintsStream();
  }
}
