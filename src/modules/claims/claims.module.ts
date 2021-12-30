import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaimsService } from './claims.service';
import { ClaimsResolver } from './claims.resolver';
import { Claim } from './entities/claim.entity';
import { AttributionsModule } from '../attributions/attributions.module';
import { SourcesModule } from '../sources/sources.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim]),
    AttributionsModule,
    SourcesModule,
    TagsModule,
  ],
  providers: [ClaimsResolver, ClaimsService],
})
export class ClaimsModule {}