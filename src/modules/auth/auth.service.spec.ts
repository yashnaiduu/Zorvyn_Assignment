import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  decode: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashed',
        isActive: false,
      });

      await expect(
        service.login({ email: 'test@test.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: await bcrypt.hash('correct', 10),
        isActive: true,
        role: 'ADMIN',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on valid credentials', async () => {
      const password = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password,
        isActive: true,
        name: 'Test',
        role: 'ADMIN',
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.login({
        email: 'test@test.com',
        password: 'correct',
      });

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('register', () => {
    it('should throw BadRequestException when email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          email: 'taken@test.com',
          password: 'pass123',
          name: 'Test',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create user and return tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'new@test.com',
        name: 'New',
        role: 'VIEWER',
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('at')
        .mockResolvedValueOnce('rt');
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.register({
        email: 'new@test.com',
        password: 'pass123',
        name: 'New',
      });

      expect(result.access_token).toBe('at');
      expect(result.user.email).toBe('new@test.com');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should null out the refresh token', async () => {
      mockPrisma.user.update.mockResolvedValue({});

      await service.logout('user-1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshToken: null },
      });
    });
  });

  describe('decodeToken', () => {
    it('should return decoded payload', () => {
      mockJwtService.decode.mockReturnValue({ sub: '1', email: 'a@b.com' });
      const result = service.decodeToken('some-token');
      expect(result).toEqual({ sub: '1', email: 'a@b.com' });
    });

    it('should return null on invalid token', () => {
      mockJwtService.decode.mockImplementation(() => {
        throw new Error('bad');
      });
      expect(service.decodeToken('invalid')).toBeNull();
    });
  });
});
