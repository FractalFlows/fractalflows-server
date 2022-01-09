import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBitsResolver } from './knowledge-bits.resolver';
import { KnowledgeBit } from './entities/knowledge-bit.entity';
import { KnowledgeBitsService } from './knowledge-bits.service';
import { AttributionsModule } from '../attributions/attributions.module';
import { ClaimsModule } from '../claims/claims.module';
import { KnowledgeBitVotesModule } from '../knowledge-bit-votes/knowledge-bit-votes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KnowledgeBit]),
    ClaimsModule,
    AttributionsModule,
    KnowledgeBitVotesModule,
  ],
  providers: [KnowledgeBitsResolver, KnowledgeBitsService],
  exports: [KnowledgeBitsService],
})
export class KnowledgeBitsModule {}
