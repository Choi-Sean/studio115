'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from './locale-switcher';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', key: 'home' },
  { href: '/projects', key: 'projects' },
  { href: '/services', key: 'services' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

export function SiteHeader({ settings }: { settings: Record<string, string> }) {
  const t = useTranslations('nav');
  const tc = useTranslations('cta');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const name = settings['company.name'] ?? 'Studio115';

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="font-display text-lg tracking-tightish">
          {name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'u-link-underline text-sm',
                isActive(n.href) ? 'text-ink' : 'text-ink-soft hover:text-ink',
              )}
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="rounded-full border border-ink px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            {tc('inquiry')}
          </Link>
        </div>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-1 md:hidden"
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
          <nav className="mx-auto flex max-w-[1280px] flex-col px-5 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'py-3 text-base',
                  isActive(n.href) ? 'text-ink' : 'text-ink-soft',
                )}
              >
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
              <LocaleSwitcher />
              <Link
                href="/contact"
                className="rounded-full border border-ink px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.18em]"
              >
                {tc('inquiry')}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
