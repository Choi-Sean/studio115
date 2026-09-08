import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { getSettings } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('intro') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([
    getTranslations('about'),
    getSettings(),
  ]);

  const description =
    settings[locale === 'en' ? 'company.description.en' : 'company.description.ko'];

  const values = ['one', 'two', 'three'] as const;

  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading title={t('title')}>{t('intro')}</SectionHeading>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl">{t('bodyTitle')}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t('body')}</p>
          </div>
          {description ? (
            <p className="text-ink-soft md:pt-10">{description}</p>
          ) : null}
        </div>

        <div className="mt-20">
          <p className="u-kicker">{t('valuesTitle')}</p>
          <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v}>
                <h3 className="font-display text-lg">{t(`values.${v}.title`)}</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {t(`values.${v}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
