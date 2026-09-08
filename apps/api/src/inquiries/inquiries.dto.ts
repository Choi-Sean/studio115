import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BUDGET_RANGES,
  INQUIRY_STATUSES,
  type BudgetRange,
  type InquiryStatus,
} from '@studio115/shared';
import { PaginationQueryDto } from '../common/pagination-query.dto';

const BUDGETS = BUDGET_RANGES as unknown as string[];
const STATUSES = INQUIRY_STATUSES as unknown as string[];

export class CreateInquiryDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(4000)
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  projectType?: string;

  @ApiPropertyOptional({ enum: BUDGET_RANGES })
  @IsOptional()
  @IsIn(BUDGETS)
  budgetRange?: BudgetRange;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  preferredContact?: string;

  /** Honeypot — must stay empty. Bots fill it in. */
  @ApiPropertyOptional({ description: 'Leave empty (spam trap)' })
  @IsOptional()
  @IsString()
  company?: string;
}

export class UpdateInquiryDto {
  @ApiPropertyOptional({ enum: INQUIRY_STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: InquiryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  adminNote?: string;
}

export class InquiryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: INQUIRY_STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: InquiryStatus;
}
