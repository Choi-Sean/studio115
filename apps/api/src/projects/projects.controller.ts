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
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Public()
  @Get()
  list(@Query() q: ProjectQueryDto) {
    return this.projects.findPublicList(q);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.projects.findPublicBySlug(slug);
  }
}

@ApiTags('admin/projects')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list(@Query() q: ProjectQueryDto) {
    return this.projects.findAllAdmin(q);
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.projects.findOneAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }
}
