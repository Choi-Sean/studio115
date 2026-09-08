import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/env';

// Proxies the contact form's file uploads to the (public) API attachments endpoint.
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/api/inquiries/attachments`, {
      method: 'POST',
      body: form,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { message: 'Upstream unavailable', detail: (err as Error).message },
      { status: 502 },
    );
  }
}
