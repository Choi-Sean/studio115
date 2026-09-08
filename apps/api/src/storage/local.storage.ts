import { Injectable, Logger } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { PresignedUpload, StorageDriver, safeKey } from './storage.types';

/**
 * Dev-only driver. Writes uploads to `apps/api/uploads/` which `main.ts`
 * serves at `/uploads/*`. In production set STORAGE_DRIVER=s3.
 */
@Injectable()
export class LocalStorage implements StorageDriver {
  readonly name = 'local';
  private readonly log = new Logger(LocalStorage.name);
  private readonly root = join(process.cwd(), 'uploads');
  private readonly apiBase = (
    process.env.API_PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 4000}`
  ).replace(/\/$/, '');

  async createUpload(input: {
    filename: string;
    prefix?: string;
  }): Promise<PresignedUpload> {
    const key = safeKey(input.filename, input.prefix ?? 'uploads');
    return {
      method: 'POST',
      uploadUrl: `${this.apiBase}/api/admin/uploads/local`,
      headers: {},
      fields: { key },
      key,
      publicUrl: this.publicUrl(key),
    };
  }

  publicUrl(key: string): string {
    return `${this.apiBase}/uploads/${key}`;
  }

  async put(key: string, body: Buffer): Promise<void> {
    const dest = join(this.root, key);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, body);
    this.log.log(`saved ${key} (${body.byteLength} bytes)`);
  }
}
