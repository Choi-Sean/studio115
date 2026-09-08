import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return { title: t('title') };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <Container className="py-8">
      <p className="u-label">{t('title')}</p>
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-label text-ink-muted">
        {t('updated')}
      </p>
      <p className="mt-8 max-w-prose text-sm leading-relaxed text-ink-soft">
        {t('body')}
      </p>
    </Container>
  );
}
