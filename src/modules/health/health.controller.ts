import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health')
@SkipThrottle()
@Controller('api/v1/health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    const dbUp = await this.prisma.$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    return {
      status: dbUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: { database: dbUp ? 'up' : 'down' },
    };
  }
}
