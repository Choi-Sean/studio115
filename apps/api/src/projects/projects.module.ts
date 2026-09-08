import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  AdminProjectsController,
  ProjectsController,
} from './projects.controller';

@Module({
  controllers: [ProjectsController, AdminProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
