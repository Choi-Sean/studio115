import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  InquiryQueryDto,
  UpdateInquiryDto,
} from './inquiries.dto';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
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
