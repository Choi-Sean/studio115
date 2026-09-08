import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { InquiriesService } from './inquiries.service';
import {
  AdminInquiriesController,
  InquiriesController,
} from './inquiries.controller';

@Module({
  imports: [StorageModule],
  controllers: [InquiriesController, AdminInquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
