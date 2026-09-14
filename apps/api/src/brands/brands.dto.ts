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

export class CreateBrandDto {
  @ApiProperty({ description: 'URL path; auto-normalised' })
  @Transform(({ value }) => (typeof value === 'string' ? slugify(value) : value))
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug!: string;

  @ApiProperty({ description: '카테고리 라벨 (예: 인테리어)' })
  @IsString()
  @MinLength(1)
  tagKo!: string;

  @ApiProperty({ description: 'Category label (e.g. Interior)' })
  @IsString()
  @MinLength(1)
  tagEn!: string;

  @ApiProperty() @IsString() @MinLength(1) nameKo!: string;
  @ApiProperty() @IsString() @MinLength(1) nameEn!: string;

  @ApiProperty() @IsString() @MinLength(1) @MaxLength(2000) descriptionKo!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(2000) descriptionEn!: string;

  @ApiPropertyOptional({ description: '런칭 여부 — false면 "Coming soon" 표시' })
  @IsOptional()
  @IsBoolean()
  live?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
