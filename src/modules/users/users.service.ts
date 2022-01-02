import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

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
