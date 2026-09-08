import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { WorkCard } from '@/components/work-card';
import { WorkFilter } from '@/components/work-filter';
import { InstagramFeed } from '@/components/instagram-feed';
import { getCategories, getProjects } from '@/lib/api';

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

  const [t, tCommon, categories, data] = await Promise.all([
    getTranslations('work'),
    getTranslations('common'),
    getCategories(),
    getProjects({ category, pageSize: 60 }),
  ]);

  const shown = categories.filter(
    (c) => c.projectCount === undefined || c.projectCount > 0,
  );

  return (
    <>
      <Container className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="u-label">{t('title')}</p>
          <WorkFilter categories={shown} allLabel={tCommon('all')} />
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
