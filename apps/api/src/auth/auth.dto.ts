import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  /** Login id — a username or email, matched against User.email. */
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(1)
  email!: string;

  @ApiProperty({ example: 'bboyong' })
  @IsString()
  @MinLength(1)
  password!: string;
}
