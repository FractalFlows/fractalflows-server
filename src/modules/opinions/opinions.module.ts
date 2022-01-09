import { Module } from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { OpinionsResolver } from './opinions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opinion } from './entities/opinion.entity';
import { ClaimsModule } from '../claims/claims.module';

@Module({
  imports: [TypeOrmModule.forFeature([Opinion]), ClaimsModule],
  providers: [OpinionsResolver, OpinionsService],
})
export class OpinionsModule {}
