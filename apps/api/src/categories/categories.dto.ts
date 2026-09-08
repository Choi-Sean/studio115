import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { slugify } from '@studio115/shared';

export class CreateCategoryDto {
  @ApiProperty({ description: 'URL path; auto-normalised' })
  @Transform(({ value }) => (typeof value === 'string' ? slugify(value) : value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  slug!: string;

  @ApiProperty() @IsString() @MinLength(1) nameKo!: string;
  @ApiProperty() @IsString() @MinLength(1) nameEn!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
