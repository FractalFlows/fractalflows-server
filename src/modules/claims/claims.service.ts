import { Injectable } from '@nestjs/common';
import { CreateClaimInput } from './dto/create-claim.input';
import { UpdateClaimInput } from './dto/update-claim.input';

@Injectable()
export class ClaimsService {
  create(createClaimInput: CreateClaimInput) {
    return 'This action adds a new claim';
  }

  findAll() {
    return `This action returns all claims`;
  }

  findOne(id: number) {
    return `This action returns a #${id} claim`;
  }

  update(id: number, updateClaimInput: UpdateClaimInput) {
    return `This action updates a #${id} claim`;
  }

  remove(id: number) {
    return `This action removes a #${id} claim`;
  }
}
