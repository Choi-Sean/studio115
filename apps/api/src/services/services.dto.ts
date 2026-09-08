import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { slugify } from '@studio115/shared';

export class CreateServiceDto {
  @ApiProperty({ description: 'URL path; auto-normalised' })
  @Transform(({ value }) => (typeof value === 'string' ? slugify(value) : value))
  @IsString()
  @MinLength(1)
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
