import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ClaimsResolver } from './claims.resolver';

@Module({
  providers: [ClaimsResolver, ClaimsService]
})
export class ClaimsModule {}
