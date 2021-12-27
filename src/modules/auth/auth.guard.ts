import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { session } = ctx.getContext().req;

    try {
      if (session.siwe) {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
