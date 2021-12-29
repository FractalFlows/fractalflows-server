import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SourcesService } from './sources.service';
import { SourcesResolver } from './sources.resolver';
import { Source } from './entities/source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  providers: [SourcesResolver, SourcesService],
})
export class SourcesModule {}
