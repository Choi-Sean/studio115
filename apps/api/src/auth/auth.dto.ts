import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@studio115.kr' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'studio115!admin', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
