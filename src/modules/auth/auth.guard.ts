// import { Injectable, CanActivate } from '@nestjs/common';

// @Injectable()
// export class AuthGuard extends CanActivate {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext) {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) {
//       return true;
//     }
//     return super.canActivate(context);
//   }
// }
