import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KnowledgeBitVote } from './entities/knowledge-bit-vote.entity';

@Injectable()
export class KnowledgeBitVotesService {
  constructor(
    @InjectRepository(KnowledgeBitVote)
    private knowledgeBitVoteRepository: Repository<KnowledgeBitVote>,
  ) {}

  async save(saveKnowledgeBitVoteInput: any) {
    return await this.knowledgeBitVoteRepository.save(
      saveKnowledgeBitVoteInput,
    );
  }

  async find(query) {
    return await this.knowledgeBitVoteRepository.find(query);
  }

  async findOne(query) {
    return await this.knowledgeBitVoteRepository.findOne(query);
  }

  async delete(query) {
    return await this.knowledgeBitVoteRepository.delete(query);
  }

  async countVotes({ knowledgeBitId, type }) {
    return this.knowledgeBitVoteRepository.count({
      knowledgeBit: knowledgeBitId,
      type,
    });
  }
}
