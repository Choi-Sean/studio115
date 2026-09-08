import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Public()
  @Get()
  get() {
    return this.settings.getMap();
  }
}

@ApiTags('admin/settings')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get() {
    return this.settings.getMap();
  }

  @Put()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.upsertMany(dto.items);
  }
}
