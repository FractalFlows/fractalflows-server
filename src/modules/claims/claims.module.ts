import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaimsService } from './claims.service';
import { ClaimsResolver } from './claims.resolver';
import { Claim } from './entities/claim.entity';
import { AttributionsModule } from '../attributions/attributions.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim]),
    AttributionsModule,
    SourcesModule,
    TagsModule,
    UsersModule,
  ],
  providers: [ClaimsResolver, ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
