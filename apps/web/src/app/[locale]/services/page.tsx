import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { ServiceIcon } from '@/components/service-icon';
import { getServices } from '@/lib/api';
import { pick } from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('title'), description: t('intro') };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, services] = await Promise.all([
    getTranslations('services'),
    getServices(),
  ]);

  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading title={t('title')}>{t('intro')}</SectionHeading>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <li
              key={s.id}
              className="grid gap-4 py-8 sm:grid-cols-[3rem_1fr] sm:gap-8 md:grid-cols-[4rem_14rem_1fr]"
            >
              <div className="flex items-start">
                <span className="text-xs text-ink-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <ServiceIcon name={s.icon} className="mt-1 h-6 w-6 text-accent" />
                <h2 className="font-display text-xl">{pick(s.title, locale)}</h2>
              </div>
              <p className="max-w-prose text-ink-soft">
                {pick(s.description, locale)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
