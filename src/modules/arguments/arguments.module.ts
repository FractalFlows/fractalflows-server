import { Module } from '@nestjs/common';
import { ArgumentsService } from './arguments.service';
import { ArgumentsResolver } from './arguments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Argument } from './entities/argument.entity';
import { ClaimsModule } from '../claims/claims.module';

@Module({
  imports: [TypeOrmModule.forFeature([Argument]), ClaimsModule],
  providers: [ArgumentsResolver, ArgumentsService],
})
export class ArgumentsModule {}
