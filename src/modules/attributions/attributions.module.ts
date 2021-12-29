import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttributionsService } from './attributions.service';
import { AttributionsResolver } from './attributions.resolver';
import { Attribution } from './entities/attribution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribution])],
  providers: [AttributionsResolver, AttributionsService],
})
export class AttributionsModule {}
