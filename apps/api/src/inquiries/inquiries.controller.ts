import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { STORAGE_DRIVER, safeKey, type StorageDriver } from '../storage/storage.types';
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  InquiryQueryDto,
  UpdateInquiryDto,
} from './inquiries.dto';

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED = /^(image\/|application\/pdf$)/;

type MulterFile = { originalname: string; mimetype: string; buffer: Buffer; size: number };

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(
    private readonly inquiries: InquiriesService,
    @Inject(STORAGE_DRIVER) private readonly storage: StorageDriver,
  ) {}

  @Public()
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }

  @Public()
  @Post('attachments')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: MAX_FILE_BYTES } }),
  )
  async attachments(@UploadedFiles() files: MulterFile[] = []) {
    if (files.length === 0) throw new BadRequestException('No files');
    const urls: string[] = [];
    for (const f of files) {
      if (!ALLOWED.test(f.mimetype)) {
        throw new BadRequestException(`Unsupported file type: ${f.mimetype}`);
      }
      const key = safeKey(f.originalname, 'inquiries');
      await this.storage.put(key, f.buffer, f.mimetype);
      urls.push(this.storage.publicUrl(key));
    }
    return { urls };
  }
}

@ApiTags('admin/inquiries')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('admin/inquiries')
export class AdminInquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Get()
  list(@Query() q: InquiryQueryDto) {
    return this.inquiries.findAll(q);
  }

  @Get('stats')
  stats() {
    return this.inquiries.stats();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.inquiries.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiries.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiries.remove(id);
  }
}
