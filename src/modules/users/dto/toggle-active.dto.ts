import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleActiveDto {
  @ApiProperty({ example: true, description: 'Set user active or inactive' })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;
}
