import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrisma = {
  auditLog: {
    create: jest.fn(),
  },
};

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logAction', () => {
    it('should create audit log using transaction client when provided', async () => {
      const txClient = {
        auditLog: { create: jest.fn().mockResolvedValue({ id: 'log-1' }) },
      };

      await service.logAction(txClient as any, 'user-1', 'CREATE', 'Record', 'entity-1');

      expect(txClient.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          action: 'CREATE',
          entity: 'Record',
          entityId: 'entity-1',
        },
      });
      expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
    });

    it('should fall back to PrismaService when tx is null', async () => {
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'log-2' });

      await service.logAction(null, 'user-1', 'DELETE', 'Record', 'entity-2');

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          action: 'DELETE',
          entity: 'Record',
          entityId: 'entity-2',
        },
      });
    });
  });
});
