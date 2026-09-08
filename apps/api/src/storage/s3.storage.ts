import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignedUpload, StorageDriver, safeKey } from './storage.types';

/**
 * S3-compatible driver. Works with Cloudflare R2, AWS S3, NCP / NHN Cloud
 * Object Storage, Wasabi, Backblaze B2, MinIO, ...
 * (Bunny.net has its own HTTP API — add a bunny.storage.ts if you pick it.)
 */
@Injectable()
export class S3Storage implements StorageDriver {
  readonly name = 's3';
  private readonly bucket = process.env.STORAGE_S3_BUCKET ?? 'studio115';
  private readonly publicBase = (
    process.env.STORAGE_PUBLIC_BASE_URL ?? ''
  ).replace(/\/$/, '');
  private readonly client = new S3Client({
    region: process.env.STORAGE_S3_REGION ?? 'auto',
    endpoint: process.env.STORAGE_S3_ENDPOINT,
    forcePathStyle: process.env.STORAGE_S3_FORCE_PATH_STYLE !== 'false',
    credentials: {
      accessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY ?? '',
    },
  });

  async createUpload(input: {
    filename: string;
    contentType: string;
    prefix?: string;
  }): Promise<PresignedUpload> {
    const key = safeKey(input.filename, input.prefix ?? 'uploads');
    const uploadUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: input.contentType,
      }),
      { expiresIn: 900 },
    );
    return {
      method: 'PUT',
      uploadUrl,
      headers: { 'Content-Type': input.contentType },
      key,
      publicUrl: this.publicUrl(key),
    };
  }

  publicUrl(key: string): string {
    if (this.publicBase) return `${this.publicBase}/${key}`;
    const ep = (process.env.STORAGE_S3_ENDPOINT ?? '').replace(/\/$/, '');
    return `${ep}/${this.bucket}/${key}`;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }
}
