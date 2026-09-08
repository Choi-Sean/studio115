import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpsertPageDto {
  @ApiProperty() @IsString() @MaxLength(200) titleKo!: string;
  @ApiProperty() @IsString() @MaxLength(200) titleEn!: string;

  @ApiProperty({ description: 'Rich HTML' })
  @IsString()
  @MaxLength(200000)
  bodyKo!: string;

  @ApiProperty({ description: 'Rich HTML' })
  @IsString()
  @MaxLength(200000)
  bodyEn!: string;
}
