import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockAuditService = {
  logAction: jest.fn(),
};

const txMock = {
  record: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockPrisma = {
  record: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock)),
};

describe('RecordsService', () => {
  let service: RecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException when record not found', async () => {
      mockPrisma.record.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('invalid-id', 'user-1', 'ADMIN'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return record for owner', async () => {
      const record = { id: 'r1', userId: 'user-1', amount: 100 };
      mockPrisma.record.findUnique.mockResolvedValue(record);

      const result = await service.findOne('r1', 'user-1', 'ANALYST');
      expect(result).toEqual(record);
    });

    it('should throw ForbiddenException for non-owner non-admin', async () => {
      const record = { id: 'r1', userId: 'user-2', amount: 100 };
      mockPrisma.record.findUnique.mockResolvedValue(record);

      await expect(
        service.findOne('r1', 'user-1', 'ANALYST'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to access any record', async () => {
      const record = { id: 'r1', userId: 'user-2', amount: 100 };
      mockPrisma.record.findUnique.mockResolvedValue(record);

      const result = await service.findOne('r1', 'admin-1', 'ADMIN');
      expect(result).toEqual(record);
    });
  });

  describe('findAll', () => {
    it('should scope records to caller for non-admin', async () => {
      mockPrisma.record.findMany.mockResolvedValue([]);
      mockPrisma.record.count.mockResolvedValue(0);

      await service.findAll({}, 'user-1', 'ANALYST');

      const whereArg = mockPrisma.record.findMany.mock.calls[0][0].where;
      expect(whereArg.userId).toBe('user-1');
    });

    it('should not scope records for admin', async () => {
      mockPrisma.record.findMany.mockResolvedValue([]);
      mockPrisma.record.count.mockResolvedValue(0);

      await service.findAll({}, 'admin-1', 'ADMIN');

      const whereArg = mockPrisma.record.findMany.mock.calls[0][0].where;
      expect(whereArg.userId).toBeUndefined();
    });

    it('should return paginated result', async () => {
      mockPrisma.record.findMany.mockResolvedValue([{ id: 'r1' }]);
      mockPrisma.record.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 }, 'a', 'ADMIN');
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 1 });
    });
  });

  describe('create', () => {
    it('should create record and log audit within transaction', async () => {
      const dto = {
        amount: 100,
        type: 'INCOME' as const,
        category: 'Salary',
        date: '2025-01-01',
        description: 'Test income',
      };
      txMock.record.create.mockResolvedValue({ id: 'r1', ...dto });
      mockAuditService.logAction.mockResolvedValue({});

      const result = await service.create('user-1', dto);

      expect(txMock.record.create).toHaveBeenCalled();
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        txMock, 'user-1', 'CREATE', 'Record', 'r1',
      );
      expect(result.id).toBe('r1');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when record missing', async () => {
      mockPrisma.record.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('invalid', 'user-1', 'ADMIN'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete and audit within transaction', async () => {
      mockPrisma.record.findUnique.mockResolvedValue({ id: 'r1', userId: 'user-1' });
      txMock.record.delete.mockResolvedValue({ id: 'r1' });
      mockAuditService.logAction.mockResolvedValue({});

      await service.remove('r1', 'user-1', 'ADMIN');

      expect(txMock.record.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
      expect(mockAuditService.logAction).toHaveBeenCalledWith(
        txMock, 'user-1', 'DELETE', 'Record', 'r1',
      );
    });
  });
});
