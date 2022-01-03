import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfuraService } from 'src/common/services/infura';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    return await this.usersRepository.save(createUserInput);
  }

  async createIfDoesntExist(createUserInput: CreateUserInput) {
    const user = await this.usersRepository.findOne({
      where: createUserInput,
    });

    if (user) {
      return user;
    } else {
      return await this.usersRepository.save(createUserInput);
    }
  }

  async getENSName(ethAddress: string): Promise<string> {
    const infuraProvider = InfuraService.getProvider('1');
    await infuraProvider.ready;
    return (await infuraProvider.lookupAddress(ethAddress)) ?? ethAddress;
  }

  async getENSAvatarURL(ethAddress: string): Promise<string | void> {
    const infuraProvider = InfuraService.getProvider('1');
    await infuraProvider.ready;
    return (await infuraProvider.getAvatar(ethAddress)) ?? '';
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(query): Promise<User> {
    return await this.usersRepository.findOne(query);
  }

  async save(query) {
    return await this.usersRepository.save(query);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
