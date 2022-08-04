import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ClaimsModule } from '../claims/claims.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { IPFSService } from './ipfs.service';

@Module({
  exports: [IPFSService],
  providers: [IPFSService],
  imports: [HttpModule],
})
export class IPFSModule {}
