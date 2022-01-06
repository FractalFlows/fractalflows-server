import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBitVotesService } from './knowledge-bit-votes.service';
import { KnowledgeBitVotesResolver } from './knowledge-bit-votes.resolver';
import { KnowledgeBitVote } from './entities/knowledge-bit-vote.entity';
import { ClaimsModule } from '../claims/claims.module';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBitVote]), ClaimsModule],
  providers: [KnowledgeBitVotesResolver, KnowledgeBitVotesService],
  exports: [KnowledgeBitVotesService],
})
export class KnowledgeBitVotesModule {}
