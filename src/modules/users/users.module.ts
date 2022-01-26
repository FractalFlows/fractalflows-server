import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AvatarSource, User, UsernameSource } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {
  constructor(private readonly usersService: UsersService) {}

  async configure() {
    const bot = await this.usersService.findOne({
      where: { username: process.env.FRACTALFLOWS_BOT_USERNAME },
    });

    if (bot === undefined) {
      this.usersService.save({
        username: process.env.FRACTALFLOWS_BOT_USERNAME,
        usernameSource: UsernameSource.CUSTOM,
        avatar: null,
        avatarSource: AvatarSource.GRAVATAR,
      });
    }
  }
}
