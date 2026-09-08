import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { ContactForm } from '@/components/contact-form';
import { Link } from '@/i18n/navigation';
import { getSettings } from '@/lib/api';

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

  const [t, settings] = await Promise.all([
    getTranslations('contact'),
    getSettings(),
  ]);

  const email = settings['contact.email'];
  const phone = settings['contact.phone'];
  const hours = settings['contact.hours'];
  const address =
    settings[locale === 'en' ? 'contact.address.en' : 'contact.address.ko'];

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

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <ContactForm />

        <aside className="space-y-5 border-t border-line pt-6 text-sm lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="u-label">{t('infoTitle')}</p>
          <ul className="space-y-3 text-ink-soft">
            {address ? <li>{address}</li> : null}
            {phone ? (
              <li>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-ink"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="hover:text-ink">
                  {email}
                </a>
              </li>
            ) : null}
          </ul>
          {hours ? (
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-label text-ink-muted">
                {t('hoursLabel')}
              </p>
              <p className="mt-1 text-ink-soft">{hours}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </Container>
  );
}
