import { Module } from '@nestjs/common';

import { ClaimsModule } from '../claims/claims.module';
import { UsersModule } from '../users/users.module';
import { FrontendService } from './frontend.service';

@Module({
  providers: [FrontendService],
  imports: [ClaimsModule, UsersModule],
})
export class FrontendModule {}
