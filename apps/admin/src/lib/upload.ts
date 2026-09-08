'use client';

import { apiFetch, API_URL } from './api';
import { getToken } from './auth';

interface Presigned {
  method: 'PUT' | 'POST';
  uploadUrl: string;
  headers: Record<string, string>;
  key: string;
  publicUrl: string;
  fields?: Record<string, string>;
}

/** Presign with the API, upload the bytes straight to storage, return the public URL. */
export async function uploadImage(file: File, prefix = 'projects'): Promise<string> {
  const pre = await apiFetch<Presigned>('/admin/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      prefix,
    }),
  });

  if (pre.method === 'PUT') {
    const res = await fetch(pre.uploadUrl, {
      method: 'PUT',
      headers: pre.headers,
      body: file,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    return pre.publicUrl;
  }

  // Local dev driver: multipart POST back to the API.
  const form = new FormData();
  for (const [k, v] of Object.entries(pre.fields ?? {})) form.append(k, v);
  form.append('file', file);
  const res = await fetch(`${API_URL}/api/admin/uploads/local`, {
    method: 'POST',
    headers: { authorization: `Bearer ${getToken() ?? ''}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const data = (await res.json()) as { publicUrl: string };
  return data.publicUrl;
}
