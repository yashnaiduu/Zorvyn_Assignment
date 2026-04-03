import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RecentTransactionsQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 5,
    description: 'Number of recent transactions to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
