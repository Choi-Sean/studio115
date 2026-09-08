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
import { PROJECT_CATEGORIES, type ProjectCategory } from '@studio115/shared';
import { PaginationQueryDto } from '../common/pagination-query.dto';

const CATEGORIES = PROJECT_CATEGORIES as unknown as string[];
const toBool = () =>
  Transform(({ value }) => value === true || value === 'true' || value === '1');

export class ProjectImageInput {
  @ApiProperty()
  @IsString()
  url!: string;

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
  @MaxLength(140)
  slug!: string;

  @ApiProperty() @IsString() titleKo!: string;
  @ApiProperty() @IsString() titleEn!: string;
  @ApiProperty() @IsString() summaryKo!: string;
  @ApiProperty() @IsString() summaryEn!: string;
  @ApiProperty() @IsString() descriptionKo!: string;
  @ApiProperty() @IsString() descriptionEn!: string;

  @ApiProperty({ enum: PROJECT_CATEGORIES })
  @IsIn(CATEGORIES)
  category!: ProjectCategory;

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

  @ApiPropertyOptional() @IsOptional() @IsString() coverImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() order?: number;

  @ApiPropertyOptional({ type: [ProjectImageInput] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageInput)
  images?: ProjectImageInput[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PROJECT_CATEGORIES })
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: ProjectCategory;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @toBool()
  @IsBoolean()
  featured?: boolean;
}
