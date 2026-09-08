'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={cn('flex items-center gap-1.5 font-mono text-xs', className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-line">/</span> : null}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: l })}
            aria-current={l === locale ? 'true' : undefined}
            className={cn(
              'uppercase tracking-label transition-colors',
              l === locale ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
