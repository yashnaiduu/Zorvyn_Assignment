import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RecentTransactionsQueryDto } from './dto/analytics-query.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('analytics:read')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get total income, expenses, and net balance' })
  @ApiResponse({ status: 200, description: 'Financial summary' })
  async getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('breakdown')
  @ApiOperation({ summary: 'Get category-wise income/expense breakdown' })
  @ApiResponse({ status: 200, description: 'Category breakdown' })
  async getCategoryBreakdown() {
    return this.analyticsService.getCategoryBreakdown();
  }

  @Get('trends')
  @ApiOperation({
    summary: 'Get monthly income/expense trends (DB-level aggregation)',
  })
  @ApiResponse({ status: 200, description: 'Monthly trends' })
  async getMonthlyTrends() {
    return this.analyticsService.getMonthlyTrends();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get most recent transactions' })
  @ApiResponse({ status: 200, description: 'Recent transactions' })
  async getRecentTransactions(@Query() query: RecentTransactionsQueryDto) {
    return this.analyticsService.getRecentTransactions(query.limit ?? 5);
  }
}
