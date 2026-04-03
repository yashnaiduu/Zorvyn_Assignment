import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: 'ANALYST' })
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}
