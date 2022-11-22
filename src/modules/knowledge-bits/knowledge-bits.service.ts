import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateKnowledgeBitInput } from './dto/create-knowledge-bit.input';
import { UpdateKnowledgeBitInput } from './dto/update-knowledge-bit.input';
import { KnowledgeBit } from './entities/knowledge-bit.entity';
import { Claim } from '../claims/entities/claim.entity';
import { User } from '../users/entities/user.entity';
import { KnowledgeBitVoteTypes } from '../knowledge-bit-votes/entities/knowledge-bit-vote.entity';
import { AttributionsService } from '../attributions/attributions.service';
import { Attribution } from '../attributions/entities/attribution.entity';
import { getClaimURL } from 'src/common/utils/claim';

@Injectable()
export class KnowledgeBitsService {
  constructor(
    @InjectRepository(KnowledgeBit)
    private readonly knowledgeBitRepository: Repository<KnowledgeBit>,
    private readonly attributionsService: AttributionsService,
  ) {}

  async create(
    createKnowledgeBitInput: CreateKnowledgeBitInput & {
      claim: Claim;
      user: User;
    },
  ) {
    return await this.knowledgeBitRepository.save(createKnowledgeBitInput);
  }

  async find(query) {
    return await this.knowledgeBitRepository.find(query);
  }

  async findOne(query) {
    return await this.knowledgeBitRepository.findOne(query);
  }

  async update(
    id: string,
    updateKnowledgeBitInput: Omit<UpdateKnowledgeBitInput, 'file'> & {
      filename?: string;
      fileCID?: string;
    },
  ) {
    return await this.knowledgeBitRepository.save({
      ...updateKnowledgeBitInput,
      id,
    });
  }

  async softDelete(id: string) {
    return await this.knowledgeBitRepository.softDelete(id);
  }

  async incrementVote({
    id,
    voteType,
  }: {
    id: string;
    voteType: KnowledgeBitVoteTypes;
  }) {
    return await this.knowledgeBitRepository.increment(
      { id },
      voteType === KnowledgeBitVoteTypes.UPVOTE
        ? 'upvotesCount'
        : 'downvotesCount',
      1,
    );
  }

  async decrementVote({
    id,
    voteType,
  }: {
    id: string;
    voteType: KnowledgeBitVoteTypes;
  }) {
    return await this.knowledgeBitRepository.decrement(
      { id },
      voteType === KnowledgeBitVoteTypes.UPVOTE
        ? 'upvotesCount'
        : 'downvotesCount',
      1,
    );
  }

  async notifyNewlyAddedAttributions({
    attributions,
    existing,
    claimSlug,
    claimTitle,
    name,
  }: {
    attributions: Attribution[];
    existing?: Attribution[];
    claimSlug: string;
    claimTitle: string;
    name: string;
  }) {
    this.attributionsService.notifyNewlyAdded({
      attributions,
      existing,
      subject: 'A knowledge bit has been attributed to you',
      html: `
          Fractal Flows is now hosting a knowledge bit named "${name}" that has been attributed to you on <a href="${getClaimURL(
        claimSlug,
      )}">${claimTitle}</a>
        `,
    });

    return true;
  }
}
