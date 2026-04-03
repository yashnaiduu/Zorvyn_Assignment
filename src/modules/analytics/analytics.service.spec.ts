import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrisma = {
  record: {
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return income, expenses, and net balance', async () => {
      mockPrisma.record.groupBy.mockResolvedValue([
        { type: 'INCOME', _sum: { amount: 5000 } },
        { type: 'EXPENSE', _sum: { amount: 3000 } },
      ]);

      const result = await service.getSummary();

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpenses).toBe(3000);
      expect(result.netBalance).toBe(2000);
    });

    it('should handle missing aggregation types', async () => {
      mockPrisma.record.groupBy.mockResolvedValue([]);

      const result = await service.getSummary();

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.netBalance).toBe(0);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should return category-wise totals', async () => {
      mockPrisma.record.groupBy.mockResolvedValue([
        { category: 'Salary', type: 'INCOME', _sum: { amount: 5000 } },
        { category: 'Rent', type: 'EXPENSE', _sum: { amount: 1500 } },
      ]);

      const result = await service.getCategoryBreakdown();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ category: 'Salary', type: 'INCOME', total: 5000 });
    });

    it('should handle null amount sums', async () => {
      mockPrisma.record.groupBy.mockResolvedValue([
        { category: 'Empty', type: 'INCOME', _sum: { amount: null } },
      ]);

      const result = await service.getCategoryBreakdown();
      expect(result[0].total).toBe(0);
    });
  });

  describe('getRecentTransactions', () => {
    it('should return recent records with default limit', async () => {
      const records = [{ id: 'r1' }, { id: 'r2' }];
      mockPrisma.record.findMany.mockResolvedValue(records);

      const result = await service.getRecentTransactions();

      expect(result).toEqual(records);
      expect(mockPrisma.record.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });

    it('should respect custom limit', async () => {
      mockPrisma.record.findMany.mockResolvedValue([]);

      await service.getRecentTransactions(3);

      expect(mockPrisma.record.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 3 }),
      );
    });
  });

  describe('getMonthlyTrends', () => {
    it('should return monthly grouped trends from raw query', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { month: new Date('2025-01-01'), type: 'INCOME', total: 5000 },
        { month: new Date('2025-01-01'), type: 'EXPENSE', total: 2000 },
        { month: new Date('2025-02-01'), type: 'INCOME', total: 3000 },
      ]);

      const result = await service.getMonthlyTrends();

      expect(result['2025-01']).toEqual({ income: 5000, expense: 2000 });
      expect(result['2025-02']).toEqual({ income: 3000, expense: 0 });
    });

    it('should return empty object when no data', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      const result = await service.getMonthlyTrends();
      expect(result).toEqual({});
    });
  });
});
