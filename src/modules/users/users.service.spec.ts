import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotFoundException } from '@nestjs/common';

const mockAuditService = {
  logAction: jest.fn(),
};

const txMock = {
  user: {
    update: jest.fn(),
  },
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock)),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: '1', email: 'a@b.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('a@b.com');
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@b.com' },
      });
    });

    it('should return null when email not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findByEmail('missing@b.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = { id: '1', email: 'a@b.com', name: 'Test', role: 'VIEWER', isActive: true };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([{ id: '1' }]);
      mockPrisma.user.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 1 });
    });

    it('should apply skip correctly for page 2', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(20);

      await service.findAll(2, 5);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5 }),
      );
    });
  });

  describe('updateRole', () => {
    it('should update role and log audit', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
      txMock.user.update.mockResolvedValue({ id: '1', role: 'ADMIN' });
      mockAuditService.logAction.mockResolvedValue({});

      const result = await service.updateRole('1', 'ADMIN' as any, 'actor-1');

      expect(txMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: { role: 'ADMIN' },
      }));
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        txMock, 'actor-1', 'UPDATE_ROLE', 'User', '1',
      );
    });

    it('should throw NotFoundException for missing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateRole('missing', 'ADMIN' as any, 'actor'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleActive', () => {
    it('should toggle active status and log audit', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
      txMock.user.update.mockResolvedValue({ id: '1', isActive: false });
      mockAuditService.logAction.mockResolvedValue({});

      await service.toggleActive('1', false, 'actor-1');

      expect(txMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: { isActive: false },
      }));
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        txMock, 'actor-1', 'TOGGLE_ACTIVE', 'User', '1',
      );
    });
  });
});
