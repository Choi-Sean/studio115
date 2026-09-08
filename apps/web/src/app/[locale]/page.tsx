import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PROJECT_CATEGORIES } from '@studio115/shared';
import { Container } from '@/components/container';
import { WorkCard } from '@/components/work-card';
import { WorkFilter } from '@/components/work-filter';
import { InstagramFeed } from '@/components/instagram-feed';
import { getProjects } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'work' });
  return { title: t('title'), description: t('intro') };
}

export default async function WorkGridPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const valid =
    category && (PROJECT_CATEGORIES as readonly string[]).includes(category)
      ? category
      : undefined;

  const [t, data, all] = await Promise.all([
    getTranslations('work'),
    getProjects({ category: valid, pageSize: 60 }),
    getProjects({ pageSize: 60 }),
  ]);

  const available = Array.from(new Set(all.items.map((p) => p.category)));

  return (
    <>
      <Container className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="u-label">{t('title')}</p>
          <WorkFilter available={available} />
        </div>

        {data.items.length === 0 ? (
          <p className="mt-20 text-sm text-ink-muted">{t('empty')}</p>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p, i) => (
              <WorkCard key={p.id} project={p} priority={i < 3} />
            ))}
          </div>
        )}
      </Container>

      <InstagramFeed />
    </>
  );
}
