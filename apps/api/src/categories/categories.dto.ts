import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
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
