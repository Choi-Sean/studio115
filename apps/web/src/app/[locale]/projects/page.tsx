import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { ProjectCard } from '@/components/project-card';
import { ProjectFilter } from '@/components/project-filter';
import { PROJECT_CATEGORIES } from '@studio115/shared';
import { getProjects } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('title'), description: t('intro') };
}

export default async function ProjectsPage({
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

  const [t, data] = await Promise.all([
    getTranslations('projects'),
    getProjects({ category: valid, pageSize: 48 }),
  ]);

  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading title={t('title')}>{t('intro')}</SectionHeading>

        <div className="mt-10 overflow-x-auto pb-1">
          <ProjectFilter />
        </div>

        {data.items.length === 0 ? (
          <p className="mt-16 text-ink-muted">{t('empty')}</p>
        ) : (
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i < 3} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
