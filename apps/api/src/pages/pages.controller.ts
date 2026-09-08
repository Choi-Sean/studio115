import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { PagesService } from './pages.service';
import { UpsertPageDto } from './pages.dto';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pages: PagesService) {}

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.pages.getBySlug(slug);
  }
}

@ApiTags('admin/pages')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('admin/pages')
export class AdminPagesController {
  constructor(private readonly pages: PagesService) {}

  @Get()
  list() {
    return this.pages.list();
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.pages.getBySlug(slug);
  }

  @Put(':slug')
  upsert(@Param('slug') slug: string, @Body() dto: UpsertPageDto) {
    return this.pages.upsert(slug, dto);
  }
}
