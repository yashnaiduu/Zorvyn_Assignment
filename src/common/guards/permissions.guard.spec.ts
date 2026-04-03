import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';

const mockCtx = (user?: object) =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => (user ? { user } : {}) }),
  }) as any;

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  it('should return true if no required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(mockCtx())).toBe(true);
  });

  it('should return false if no user', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['record:create']);
    expect(guard.canActivate(mockCtx())).toBe(false);
  });

  it('should return true if user has required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['record:delete']);
    expect(guard.canActivate(mockCtx({ role: 'ADMIN' }))).toBe(true);
  });

  it('should return false if user role lacks required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['record:delete']);
    expect(guard.canActivate(mockCtx({ role: 'VIEWER' }))).toBe(false);
  });
});
