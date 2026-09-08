'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from './locale-switcher';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', key: 'work' },
  { href: '/stiio', key: 'stiio' },
  { href: '/contact', key: 'contact' },
  { href: '/about', key: 'about' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/' || pathname.startsWith('/work')
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link href="/" className="text-[0.95rem] font-medium tracking-wide">
          Studio<span className="text-ink-muted">115</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'font-mono text-xs tracking-label transition-colors',
                isActive(n.href) ? 'text-ink' : 'text-ink-muted hover:text-ink',
              )}
            >
              {t(n.key)}
            </Link>
          ))}
          <LocaleSwitcher className="ml-1" />
        </nav>

        <button
          type="button"
          className="flex flex-col gap-[5px] p-1 md:hidden"
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-px w-6 bg-ink" />
          <span className={cn('block h-px w-6 bg-ink transition', open && 'opacity-0')} />
          <span className="block h-px w-6 bg-ink" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper md:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-5 py-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'py-3 font-mono text-sm tracking-label',
                  isActive(n.href) ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {t(n.key)}
              </Link>
            ))}
            <div className="border-t border-line py-4">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
