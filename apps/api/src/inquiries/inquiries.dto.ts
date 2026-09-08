import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CONTRACT_STATUSES,
  INQUIRY_STATUSES,
  PROJECT_SCOPES,
  type ContractStatus,
  type InquiryStatus,
  type ProjectScope,
} from '@studio115/shared';
import { PaginationQueryDto } from '../common/pagination-query.dto';

const STATUSES = INQUIRY_STATUSES as unknown as string[];
const SCOPES = PROJECT_SCOPES as unknown as string[];
const CONTRACTS = CONTRACT_STATUSES as unknown as string[];

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

  @ApiProperty({ description: '업종' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  industry!: string;

  @ApiPropertyOptional({ description: '상호 (예비상호)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  businessName?: string;

  @ApiProperty({ description: '프로젝트 지역 (주소)' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  region!: string;

  @ApiPropertyOptional({ description: '상세주소' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressDetail?: string;

  @ApiPropertyOptional({ enum: PROJECT_SCOPES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(SCOPES, { each: true })
  scopes?: ProjectScope[];

  @ApiPropertyOptional({ enum: CONTRACT_STATUSES })
  @IsOptional()
  @IsIn(CONTRACTS)
  contractStatus?: ContractStatus;

  @ApiProperty({ description: '프로젝트 설명' })
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  message!: string;

  @ApiPropertyOptional({ description: '프로젝트 예산 (자유 입력)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  budgetText?: string;

  @ApiPropertyOptional({ type: [String], description: '첨부 파일 URL' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  attachments?: string[];

  @ApiProperty({ description: '개인정보 수집·이용 동의' })
  @IsBoolean()
  privacyConsent!: boolean;

  /** Honeypot — must stay empty. */
  @ApiPropertyOptional({ description: 'Leave empty (spam trap)' })
  @IsOptional()
  @IsString()
  website?: string;
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
