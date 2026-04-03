import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
  IsInt,
  Max,
} from 'class-validator';
import { RecordType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({ minimum: 0, example: 1500.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;

  @ApiProperty({ enum: RecordType, example: 'INCOME' })
  @IsNotEmpty()
  @IsEnum(RecordType)
  type!: RecordType;

  @ApiProperty({ maxLength: 100, example: 'Salary' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  category!: string;

  @ApiProperty({ example: '2026-04-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiProperty({ maxLength: 1000, example: 'Monthly salary deposit' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description!: string;
}

export class UpdateRecordDto {
  @ApiPropertyOptional({ minimum: 0, example: 2000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ enum: RecordType })
  @IsOptional()
  @IsEnum(RecordType)
  type?: RecordType;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: '2026-04-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class FilterRecordDto {
  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: RecordType })
  @IsOptional()
  @IsEnum(RecordType)
  type?: RecordType;

  @ApiPropertyOptional({ example: 'Salary' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
