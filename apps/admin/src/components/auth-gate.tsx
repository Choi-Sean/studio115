'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getToken()) setReady(true);
    else router.replace('/login');
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-neutral-400">
        …
      </div>
    );
  }
  return <>{children}</>;
}
