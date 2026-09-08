import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@studio115/shared';

export const ROLES_KEY = 'roles';

/** Restricts a route to the given roles. No decorator = any authenticated user. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
