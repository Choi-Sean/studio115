import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AdminPagesController, PagesController } from './pages.controller';

@Module({
  controllers: [PagesController, AdminPagesController],
  providers: [PagesService],
})
export class PagesModule {}
