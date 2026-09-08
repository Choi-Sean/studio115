import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fraunces, Noto_Sans_KR } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getSettings } from '@/lib/api';
import { SITE_URL } from '@/lib/env';
import '../globals.css';

const sans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('titleDefault'), template: t('titleTemplate') },
    description: t('description'),
    openGraph: {
      siteName: 'Studio115',
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);

  const [messages, settings] = await Promise.all([getMessages(), getSettings()]);

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader settings={settings} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
