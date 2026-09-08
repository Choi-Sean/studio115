import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class SettingItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  key!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(8000)
  value!: string;
}

export class UpdateSettingsDto {
  @ApiProperty({ type: [SettingItemDto] })
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => SettingItemDto)
  items!: SettingItemDto[];
}
