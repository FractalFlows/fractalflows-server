import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import request from 'request';

import { ClaimsService } from '../claims/claims.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FrontendService {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(FrontendService.name);

  @Cron('* */5 * * * *')
  async warmVercelServerlessFunctions() {
    if (process.env.APP_ENV === 'development') return;

    this.logger.log('Called warmVercelServerlessFunctions cron');

    const claim = await this.claimsService.findOne({});
    const user = await this.usersService.findOne({});

    // home
    request(`${process.env.FRONTEND_HOST}`, (error) => {
      if (error)
        this.logger.error('Error on warmVercelServerlessFunctions', error);
    });

    // claim page
    if (claim) {
      request(`${process.env.FRONTEND_HOST}/claim/${claim.slug}`, (error) => {
        if (error)
          this.logger.error('Error on warmVercelServerlessFunctions', error);
      });
    }

    // user profile page
    if (user) {
      request(
        `${process.env.FRONTEND_HOST}/profile/${user.username}`,
        (error) => {
          if (error)
            this.logger.error('Error on warmVercelServerlessFunctions', error);
        },
      );
    }
  }
}
