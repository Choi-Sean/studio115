import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { HoverGallery } from '@/components/hover-gallery';
import { getProjects } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'stiio' });
  return { title: t('title'), description: t('intro') };
}

const BRAND_KEYS = ['interior', 'textile', 'furniture', 'home'] as const;
const LIVE = new Set(['interior']);

export default async function StiioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCommon, projects] = await Promise.all([
    getTranslations('stiio'),
    getTranslations('common'),
    getProjects({ pageSize: 8 }),
  ]);

  const galleryItems = projects.items.flatMap((p) =>
    p.media
      .filter((m) => m.type === 'IMAGE')
      .slice(0, 1)
      .map((m) => ({ src: m.url, caption: p.title.en })),
  );

  return (
    <Container className="py-8">
      <SectionHeading label={t('title')} title={undefined}>
        {t('intro')}
      </SectionHeading>

      {/* Sub-brands */}
      <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {BRAND_KEYS.map((k) => {
          const live = LIVE.has(k);
          return (
            <div
              key={k}
              className="flex min-h-40 flex-col justify-between bg-paper p-5"
            >
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-label text-ink-muted">
                  {t(`brands.${k}.tag`)}
                </p>
                <p className="mt-2 font-medium">{t(`brands.${k}.name`)}</p>
                <p className="mt-1.5 text-sm text-ink-soft">
                  {t(`brands.${k}.desc`)}
                </p>
              </div>
              {!live ? (
                <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-label text-ink-muted">
                  {tCommon('comingSoon')}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Hover gallery */}
      {galleryItems.length > 0 ? (
        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4">
            <p className="u-label">{t('galleryTitle')}</p>
            <p className="text-xs text-ink-muted">{t('galleryHint')}</p>
          </div>
          <div className="mt-6">
            <HoverGallery items={galleryItems} />
          </div>
        </section>
      ) : null}

      {/* Journal */}
      <section className="mt-20 border-t border-line pt-8">
        <p className="u-label">{t('journalTitle')}</p>
        <p className="mt-3 max-w-prose text-sm text-ink-soft">{t('journalIntro')}</p>
        <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-label text-ink-muted">
          {t('journalComingSoon')}
        </p>
      </section>
    </Container>
  );
}
