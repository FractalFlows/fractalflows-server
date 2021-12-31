import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Not } from 'typeorm';
import { ConsoleLogger, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SessionGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    // return this.usersService.create(createUserInput);
    return true;
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(SessionGuard)
  async updateEmail(@Args('email') email: string, @Context() context) {
    const userId = context.req.session.user.id;

    const inUse = await this.usersService.findOne({
      where: { email, id: Not(userId) },
    });

    if (inUse) {
      throw new Error('Email already in use');
    } else {
      const user = this.usersService.updateEmail(userId, email);
      context.req.session.user.email = email;
      return user;
    }
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
