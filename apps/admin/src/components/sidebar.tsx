'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: '대시보드' },
  { href: '/projects', label: '프로젝트' },
  { href: '/services', label: '서비스' },
  { href: '/inquiries', label: '문의' },
  { href: '/settings', label: '사이트 설정' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => setName(getUser()?.name ?? ''), []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <p className="font-semibold">Studio115</p>
        <p className="text-xs text-neutral-400">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              'block rounded-md px-3 py-2 text-sm transition-colors',
              isActive(n.href)
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100',
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-neutral-200 p-3 text-xs text-neutral-500">
        <p className="px-2 pb-2">{name}</p>
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.replace('/login');
          }}
          className="w-full rounded-md px-2 py-1.5 text-left hover:bg-neutral-100"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
