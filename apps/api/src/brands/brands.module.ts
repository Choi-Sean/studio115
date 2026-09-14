import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { AdminBrandsController, BrandsController } from './brands.controller';

@Module({
  controllers: [BrandsController, AdminBrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
