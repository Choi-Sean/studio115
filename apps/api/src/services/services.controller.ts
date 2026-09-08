import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Get()
  list() {
    return this.services.findPublic();
  }
}

@ApiTags('admin/services')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('admin/services')
export class AdminServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  list() {
    return this.services.findAllAdmin();
  }

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.services.remove(id);
  }
}
