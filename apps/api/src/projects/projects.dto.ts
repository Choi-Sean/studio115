import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MEDIA_TYPES, type MediaType } from '@studio115/shared';
import { PaginationQueryDto } from '../common/pagination-query.dto';

const toBool = () =>
  Transform(({ value }) => value === true || value === 'true' || value === '1');

export class ProjectMediaInput {
  @ApiPropertyOptional({ enum: MEDIA_TYPES, default: 'IMAGE' })
  @IsOptional()
  @IsIn(MEDIA_TYPES as unknown as string[])
  type?: MediaType;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  slug!: string;

  @ApiProperty() @IsString() titleKo!: string;
  @ApiProperty() @IsString() titleEn!: string;
  @ApiProperty() @IsString() summaryKo!: string;
  @ApiProperty() @IsString() summaryEn!: string;

  @ApiProperty({ description: 'Rich HTML' }) @IsString() descriptionKo!: string;
  @ApiProperty({ description: 'Rich HTML' }) @IsString() descriptionEn!: string;

  @ApiProperty() @IsString() @MaxLength(30) categoryId!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sizeLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() involvement?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completionDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photography?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaSqm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) coverImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() order?: number;

  @ApiPropertyOptional({ type: [ProjectMediaInput] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMediaInput)
  media?: ProjectMediaInput[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBool()
  @IsBoolean()
  featured?: boolean;
}
