import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API info', () => {
      const result = appController.getRoot();
      expect(result).toEqual({
        name: 'Zorvyn Finance API',
        version: '1.0.0',
        status: 'running',
        docs: '/api/docs',
        health: '/api/v1/health',
      });
    });
  });
});
