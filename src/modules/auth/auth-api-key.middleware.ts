import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthAPIKeyMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('fractalflows-api-key');

    if (apiKey) {
      const user = await this.usersService.findOne({ where: { apiKey } });
      req.session.user = user;
    }

    next();
  }
}
