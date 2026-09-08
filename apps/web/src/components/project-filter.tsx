'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PROJECT_CATEGORIES } from '@studio115/shared';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const base =
  'rounded-full border px-3.5 py-1.5 text-xs transition-colors whitespace-nowrap';

export function ProjectFilter() {
  const active = useSearchParams().get('category');
  const t = useTranslations('projects');
  const tc = useTranslations('projects.category');

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/projects"
        className={cn(
          base,
          !active
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-ink-soft hover:border-ink',
        )}
      >
        {t('filterAll')}
      </Link>
      {PROJECT_CATEGORIES.map((c) => (
        <Link
          key={c}
          href={{ pathname: '/projects', query: { category: c } }}
          className={cn(
            base,
            active === c
              ? 'border-ink bg-ink text-paper'
              : 'border-line text-ink-soft hover:border-ink',
          )}
        >
          {tc(c)}
        </Link>
      ))}
    </div>
  );
}
