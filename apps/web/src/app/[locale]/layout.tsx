import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JetBrains_Mono, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FloatingActions } from '@/components/floating-actions';
import { getSettings } from '@/lib/api';
import { SITE_URL } from '@/lib/env';
import '../globals.css';

// Noto Sans KR stays as the last-resort fallback for any glyph Orbit lacks
// (rare hanja, obsolete jamo) — Orbit itself now covers Hangul + Latin.
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

// Korean "Orbit" by Sooun Cho / JAMO (noonnu.cc) — unlike Google Fonts'
// Latin-only "Orbit", this one draws both Hangul and Latin glyphs itself.
const orbit = localFont({
  src: '../../fonts/orbit-kr/Orbit-Regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-orbit',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
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
      siteName: 'Studiollo',
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
      images: [{ url: '/og-image.png', width: 3705, height: 2230 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.png'],
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
    <html
      lang={locale}
      className={`${notoSansKr.variable} ${orbit.variable} ${mono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <FloatingActions
            phone={settings['contact.phone']}
            instagram={settings['social.instagram']}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
