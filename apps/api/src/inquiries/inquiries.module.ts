import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import {
  AdminInquiriesController,
  InquiriesController,
} from './inquiries.controller';

@Module({
  controllers: [InquiriesController, AdminInquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
