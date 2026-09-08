import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @MaxLength(140)
  slug!: string;

  @ApiProperty() @IsString() titleKo!: string;
  @ApiProperty() @IsString() titleEn!: string;
  @ApiProperty() @IsString() descriptionKo!: string;
  @ApiProperty() @IsString() descriptionEn!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() order?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
