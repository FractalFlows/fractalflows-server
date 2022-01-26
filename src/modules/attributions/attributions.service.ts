import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sendMail } from 'src/common/services/mail';
import { Repository } from 'typeorm';

import { SaveAttributionInput } from './dto/save-attribution.input';
import { Attribution } from './entities/attribution.entity';

@Injectable()
export class AttributionsService {
  constructor(
    @InjectRepository(Attribution)
    private attributionsRepository: Repository<Attribution>,
  ) {}

  async save(saveAttributionInput: SaveAttributionInput[]) {
    return await this.attributionsRepository.upsert(
      saveAttributionInput || [],
      ['identifier'],
    );
  }

  async upsert(saveAttributionInput: SaveAttributionInput[]) {
    return await this.attributionsRepository.upsert(
      saveAttributionInput || [],
      ['identifier'],
    );
  }

  findAll() {
    return `This action returns all attributions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribution`;
  }

  async notifyNewlyAdded({
    attributions = [],
    existing = [],
    subject,
    html,
  }: {
    attributions: Attribution[];
    existing?: Attribution[];
    subject: string;
    html: string;
  }) {
    const newlyAddedAttributionsByEmail = attributions
      .filter(
        ({ origin, identifier }) =>
          origin === 'email' &&
          existing.find(
            (attribution) => attribution.identifier === identifier,
          ) === undefined,
      )
      .map(({ identifier }) => identifier);

    if (newlyAddedAttributionsByEmail.length > 0) {
      await sendMail({
        to: newlyAddedAttributionsByEmail,
        subject,
        html,
      });
    }

    return true;
  }
}
