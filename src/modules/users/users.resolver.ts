import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Not } from 'typeorm';
import { UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { SessionGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
  async updateEmail(@Args('email') email: string, @Context() context) {
    const userId = context.req.session.user.id;

    const isEmailAlreadyInUse = await this.usersService.findOne({
      where: { email, id: Not(userId) },
    });

    if (isEmailAlreadyInUse) {
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
