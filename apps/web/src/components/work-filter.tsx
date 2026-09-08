'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { CategoryDto } from '@studio115/shared';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function WorkFilter({
  categories,
  allLabel,
}: {
  categories: CategoryDto[];
  allLabel: string;
}) {
  const active = useSearchParams().get('category');
  const locale = useLocale();

  const cls = (on: boolean) =>
    cn(
      'font-mono text-xs uppercase tracking-label transition-colors',
      on ? 'text-ink' : 'text-ink-muted hover:text-ink',
    );

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <Link href="/" className={cls(!active)}>
        {allLabel}
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={{ pathname: '/', query: { category: c.slug } }}
          className={cls(active === c.slug)}
        >
          {locale === 'en' ? c.name.en : c.name.ko}
        </Link>
      ))}
    </div>
  );
}
