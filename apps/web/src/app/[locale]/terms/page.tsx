import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { RichHtml } from '@/components/rich-html';
import { pick } from '@/lib/format';
import { getPage } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage('terms');
  return { title: pick(page.title, locale) };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage('terms');

  return (
    <Container className="py-8">
      <p className="u-label">{pick(page.title, locale)}</p>
      <RichHtml html={pick(page.body, locale)} className="mt-8 max-w-prose" />
    </Container>
  );
}
