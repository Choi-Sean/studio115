import { Module } from '@nestjs/common';
import { STORAGE_DRIVER } from './storage.types';
import { LocalStorage } from './local.storage';
import { S3Storage } from './s3.storage';
import { StorageController } from './storage.controller';

@Module({
  controllers: [StorageController],
  providers: [
    LocalStorage,
    S3Storage,
    {
      provide: STORAGE_DRIVER,
      inject: [LocalStorage, S3Storage],
      useFactory: (local: LocalStorage, s3: S3Storage) =>
        (process.env.STORAGE_DRIVER ?? 'local') === 's3' ? s3 : local,
    },
  ],
  exports: [STORAGE_DRIVER],
})
export class StorageModule {}
