import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import {
  AdminSettingsController,
  SettingsController,
} from './settings.controller';

@Module({
  controllers: [SettingsController, AdminSettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
