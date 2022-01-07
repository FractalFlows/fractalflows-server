import { Module } from '@nestjs/common';

import { ArgumentCommentsService } from './argument-comments.service';
import { ArgumentCommentsResolver } from './argument-comments.resolver';
import { ArgumentComment } from './entities/argument-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArgumentComment])],
  providers: [ArgumentCommentsResolver, ArgumentCommentsService],
})
export class ArgumentCommentsModule {}
