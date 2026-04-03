import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@zorvyn.com', maxLength: 255 })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password!: string;

  @ApiProperty({ example: 'John Doe', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@zorvyn.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Valid refresh token from a prior login' })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
