import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleActiveDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;
}
