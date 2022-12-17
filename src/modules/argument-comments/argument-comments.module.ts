import { Module } from '@nestjs/common';

import { ArgumentCommentsService } from './argument-comments.service';
import { ArgumentCommentsResolver } from './argument-comments.resolver';
import { ArgumentComment } from './entities/argument-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimsModule } from '../claims/claims.module';
import { ArgumentsModule } from '../arguments/arguments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArgumentComment]),
    ClaimsModule,
    ArgumentsModule,
  ],
  providers: [ArgumentCommentsResolver, ArgumentCommentsService],
})
export class ArgumentCommentsModule {}
