import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return (
        context.switchToHttp().getRequest().session.user ??
        context.switchToHttp().getRequest().user
      );
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.session.user ?? ctx.getContext().req.user;
  },
);
