import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';
import { Claim } from './entities/claim.entity';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim) private claimsRepository: Repository<Claim>,
  ) {}

  async create(createClaimInput: CreateClaimInput & { user: User }) {
    let slug;
    let slugIndex = 0;

    do {
      slug = `${slugify(createClaimInput.title, {
        lower: true,
        strict: true,
      })}${slugIndex > 0 ? `-${slugIndex}` : ''}`;

      slugIndex++;
    } while (
      (await this.claimsRepository.findOne({ where: { slug } })) !== undefined
    );

    return await this.claimsRepository.save({ ...createClaimInput, slug });
  }

  async findAll() {
    return await this.claimsRepository.find();
  }

  async find(query) {
    return await this.claimsRepository.find(query);
  }

  async findByUserId(userId: string) {
    return await this.claimsRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findOne(slug: string) {
    return await this.claimsRepository.findOne({ slug });
  }

  update(id: number, updateClaimInput: UpdateClaimInput) {
    return `This action updates a #${id} claim`;
  }

  remove(id: number) {
    return `This action removes a #${id} claim`;
  }
}
