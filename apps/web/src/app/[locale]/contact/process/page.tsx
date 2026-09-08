import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { ProcessList } from '@/components/process-list';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'process' });
  return { title: t('title'), description: t('intro') };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('process');

  return (
    <Container className="py-8">
      <Link
        href="/contact"
        className="font-mono text-xs uppercase tracking-label text-ink-muted hover:text-ink"
      >
        ← CONTACT
      </Link>

      <div className="mt-6">
        <p className="u-label">{t('title')}</p>
        <h1 className="mt-3 text-xl font-medium sm:text-2xl">{t('subtitle')}</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {t('intro')}
        </p>
      </div>

      <div className="mt-12">
        <ProcessList />
      </div>
    </Container>
  );
}
