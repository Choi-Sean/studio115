import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Roles } from '../auth/roles.decorator';
import { STORAGE_DRIVER, type StorageDriver } from './storage.types';

class PresignBodyDto {
  @IsString() filename!: string;
  @IsString() contentType!: string;
  @IsOptional() @IsString() prefix?: string;
}

type UploadedMulterFile = { buffer: Buffer; mimetype: string; size: number };

@ApiTags('admin/uploads')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('admin/uploads')
export class StorageController {
  constructor(
    @Inject(STORAGE_DRIVER) private readonly storage: StorageDriver,
  ) {}

  /** Step 1: get a URL the browser can upload the file straight to. */
  @Post('presign')
  presign(@Body() dto: PresignBodyDto) {
    return this.storage.createUpload(dto);
  }

  /** Dev fallback: local driver accepts the bytes directly (multipart). */
  @Post('local')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async local(
    @UploadedFile() file: UploadedMulterFile | undefined,
    @Body('key') key?: string,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!key) throw new BadRequestException('key is required');
    await this.storage.put(key, file.buffer, file.mimetype);
    return { key, publicUrl: this.storage.publicUrl(key) };
  }
}
