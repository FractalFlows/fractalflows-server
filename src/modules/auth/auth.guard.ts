import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserRole } from '../users/entities/user.entity';

export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      if (req.session.user || req.user) {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    try {
      const user = req.session.user || req.user;

      if (user && user.role === UserRole.ADMIN) {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
