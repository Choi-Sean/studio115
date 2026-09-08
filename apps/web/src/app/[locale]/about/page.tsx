import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { getProjects, getServices, getSettings } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

function LabelList({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div className="border-t border-line pt-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-label text-ink-muted">
        {label}
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-ink-soft">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, services, projects, settings] = await Promise.all([
    getTranslations('about'),
    getServices(),
    getProjects({ pageSize: 12 }),
    getSettings(),
  ]);

  const coreValues = (['one', 'two', 'three'] as const).map((k) =>
    t(`coreValues.${k}`),
  );

  return (
    <Container className="py-8">
      <p className="u-label">{t('title')}</p>

      <p className="mt-10 max-w-3xl text-2xl font-medium leading-snug sm:text-3xl md:text-4xl">
        “{settings['company.tagline.en']}”
      </p>
      <p className="mt-2 text-lg text-ink-muted">
        “{settings['company.tagline.ko']}”
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_18rem] md:gap-16">
        <div className="max-w-prose space-y-5 text-sm leading-relaxed">
          <p className="text-ink-soft">{settings['about.lead.en']}</p>
          <p className="text-ink-soft">{settings['about.body.en']}</p>
          <div className="space-y-4 border-t border-line pt-6">
            <p className="text-ink-soft">{settings['about.lead.ko']}</p>
            <p className="text-ink-soft">{settings['about.body.ko']}</p>
          </div>
        </div>

        <div className="space-y-8">
          <LabelList
            label={t('sections.services')}
            items={services.map((s) => s.title.en.toUpperCase())}
          />
          <LabelList
            label={t('sections.coreValues')}
            items={coreValues}
          />
          <LabelList
            label={t('sections.featuredSpaces')}
            items={projects.items.map((p) => p.title.en)}
          />
        </div>
      </div>
    </Container>
  );
}
