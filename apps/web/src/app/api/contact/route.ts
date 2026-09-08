import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/env';

// Same-origin proxy for the public contact form → keeps the browser off the
// cross-origin API and lets us swap in spam checks / rate limiting later.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
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
