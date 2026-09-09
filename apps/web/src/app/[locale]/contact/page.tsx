import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { ContactForm } from '@/components/contact-form';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title'), description: t('intro') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  return (
    <Container className="py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading label={t('title')}>{t('intro')}</SectionHeading>
        <Link
          href="/contact/process"
          className="font-mono text-xs uppercase tracking-label text-ink-muted hover:text-ink"
        >
          {t('processLink')} →
        </Link>
      </div>

      <div className="mt-12 max-w-2xl">
        <ContactForm />
      </div>
    </Container>
  );
}
