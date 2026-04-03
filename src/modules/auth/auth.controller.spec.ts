import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  decodeToken: jest.fn(),
  refreshTokens: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should delegate to AuthService.register', async () => {
      const dto = { email: 'a@b.com', password: 'pass123', name: 'Test' };
      const expected = { access_token: 'at', refresh_token: 'rt', user: {} };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should delegate to AuthService.login', async () => {
      const dto = { email: 'a@b.com', password: 'pass123' };
      const expected = { access_token: 'at', refresh_token: 'rt', user: {} };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should decode token and refresh', async () => {
      mockAuthService.decodeToken.mockReturnValue({ sub: 'user-1' });
      mockAuthService.refreshTokens.mockResolvedValue({
        access_token: 'new-at',
        refresh_token: 'new-rt',
      });

      const result = await controller.refresh({ refreshToken: 'old-rt' });

      expect(result.access_token).toBe('new-at');
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        'user-1',
        'old-rt',
      );
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      mockAuthService.decodeToken.mockReturnValue(null);

      await expect(
        controller.refresh({ refreshToken: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delegate to AuthService.logout and return message', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);
      const req = {
        user: { id: 'user-1', email: 'a@b.com', role: 'ADMIN' },
      } as any;

      const result = await controller.logout(req);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-1');
    });
  });
});
