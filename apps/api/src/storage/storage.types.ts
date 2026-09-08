export interface PresignedUpload {
  /** How the client should send the bytes. */
  method: 'PUT' | 'POST';
  /** Where the client uploads to. */
  uploadUrl: string;
  /** Extra headers the client must send with the upload request. */
  headers: Record<string, string>;
  /** Object key — persist this alongside the public URL. */
  key: string;
  /** Public, CDN-facing URL where the object will be readable. */
  publicUrl: string;
  /** For multipart/form POST uploads, extra fields to include. */
  fields?: Record<string, string>;
}

export interface StorageDriver {
  readonly name: string;
  createUpload(input: {
    filename: string;
    contentType: string;
    prefix?: string;
  }): Promise<PresignedUpload>;
  publicUrl(key: string): string;
  /** Only the local (dev) driver implements this — accepts a direct upload. */
  save?(key: string, body: Buffer, contentType: string): Promise<void>;
}

export const STORAGE_DRIVER = 'STORAGE_DRIVER';

export function safeKey(filename: string, prefix = 'uploads'): string {
  const clean = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix.replace(/^\/|\/$/g, '')}/${stamp}-${rand}-${clean || 'file'}`;
}
