'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PROJECT_CATEGORIES } from '@studio115/shared';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function WorkFilter({ available }: { available: string[] }) {
  const active = useSearchParams().get('category');
  const tc = useTranslations('work.categories');
  const tCommon = useTranslations('common');

  const cats = PROJECT_CATEGORIES.filter((c) => available.includes(c));
  const cls = (on: boolean) =>
    cn(
      'font-mono text-xs uppercase tracking-label transition-colors',
      on ? 'text-ink' : 'text-ink-muted hover:text-ink',
    );

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <Link href="/" className={cls(!active)}>
        {tCommon('all')}
      </Link>
      {cats.map((c) => (
        <Link
          key={c}
          href={{ pathname: '/', query: { category: c } }}
          className={cls(active === c)}
        >
          {tc(c)}
        </Link>
      ))}
    </div>
  );
}
