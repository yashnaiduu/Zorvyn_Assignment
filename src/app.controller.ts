import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Zorvyn Finance API',
      version: '1.0.0',
      status: 'running',
      docs: '/api/docs',
      health: '/api/v1/health',
    };
  }
}
