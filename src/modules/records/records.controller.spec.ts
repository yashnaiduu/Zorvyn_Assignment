import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

const mockRecordsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockReq = {
  user: { id: 'user-1', email: 'a@b.com', role: 'ADMIN' },
} as any;

describe('RecordsController', () => {
  let controller: RecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [{ provide: RecordsService, useValue: mockRecordsService }],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should pass userId from request to service', async () => {
      const dto = {
        amount: 100,
        type: 'INCOME' as const,
        category: 'Salary',
        date: '2025-01-01',
        description: 'Test',
      };
      mockRecordsService.create.mockResolvedValue({ id: 'r1', ...dto });

      await controller.create(mockReq, dto);

      expect(mockRecordsService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should pass caller info to service', async () => {
      const filterDto = { page: 1, limit: 10 };
      mockRecordsService.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll(mockReq, filterDto as any);

      expect(mockRecordsService.findAll).toHaveBeenCalledWith(
        filterDto, 'user-1', 'ADMIN',
      );
    });
  });

  describe('findOne', () => {
    it('should delegate to service with id and caller', async () => {
      mockRecordsService.findOne.mockResolvedValue({ id: 'r1' });

      await controller.findOne(mockReq, 'r1');

      expect(mockRecordsService.findOne).toHaveBeenCalledWith('r1', 'user-1', 'ADMIN');
    });
  });

  describe('update', () => {
    it('should delegate to service with all params', async () => {
      const dto = { amount: 200 };
      mockRecordsService.update.mockResolvedValue({ id: 'r1', amount: 200 });

      await controller.update('r1', dto as any, mockReq);

      expect(mockRecordsService.update).toHaveBeenCalledWith(
        'r1', dto, 'user-1', 'ADMIN',
      );
    });
  });

  describe('remove', () => {
    it('should delegate to service with id and caller', async () => {
      mockRecordsService.remove.mockResolvedValue({ id: 'r1' });

      await controller.remove('r1', mockReq);

      expect(mockRecordsService.remove).toHaveBeenCalledWith('r1', 'user-1', 'ADMIN');
    });
  });
});
