import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

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
  @ApiOperation({ summary: 'Get monthly income/expense trends (DB-level aggregation)' })
  @ApiResponse({ status: 200, description: 'Monthly trends' })
  async getMonthlyTrends() {
    return this.analyticsService.getMonthlyTrends();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get most recent transactions' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recent transactions (default 5)' })
  @ApiResponse({ status: 200, description: 'Recent transactions' })
  async getRecentTransactions(@Query('limit') limit?: string) {
    return this.analyticsService.getRecentTransactions(limit ? Number(limit) : 5);
  }
}
