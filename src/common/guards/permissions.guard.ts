import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

// Map Roles to allowed Permissions
const RolePermissions: Record<Role, string[]> = {
  ADMIN: [
    'record:create',
    'record:read',
    'record:update',
    'record:delete',
    'user:manage',
    'analytics:read',
  ],
  ANALYST: ['record:read', 'analytics:read'],
  VIEWER: ['analytics:read'],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) return false;

    const userPermissions = RolePermissions[user.role as Role] || [];
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
