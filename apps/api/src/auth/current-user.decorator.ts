import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUserDto } from '@studio115/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserDto =>
    ctx.switchToHttp().getRequest().user,
);
