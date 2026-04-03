import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrisma = {
  $queryRaw: jest.fn(),
};

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok when database is reachable', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.services.database).toBe('up');
    expect(result.timestamp).toBeDefined();
  });

  it('should return degraded when database is unreachable', async () => {
    mockPrisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const result = await controller.check();

    expect(result.status).toBe('degraded');
    expect(result.services.database).toBe('down');
  });
});
