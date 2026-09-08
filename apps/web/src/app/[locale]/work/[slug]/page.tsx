import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { RichHtml } from '@/components/rich-html';
import { Link } from '@/i18n/navigation';
import { getProject } from '@/lib/api';
import { pick } from '@/lib/format';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return {
    title: p.title.en,
    description: pick(p.summary, locale),
    openGraph: p.coverImageUrl ? { images: [p.coverImageUrl] } : undefined,
  };
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tCommon, p] = await Promise.all([
    getTranslations('work'),
    getTranslations('common'),
    getProject(slug),
  ]);
  if (!p) notFound();

  const meta: Array<[string, string | null]> = [
    [t('meta.type'), p.type],
    [t('meta.location'), p.location],
    [t('meta.size'), p.sizeLabel ?? (p.areaSqm ? `${p.areaSqm} m²` : null)],
    [t('meta.involvement'), p.involvement],
    [t('meta.completion'), p.completionDate],
    [t('meta.photography'), p.photography],
  ];

  return (
    <Container className="py-8">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-label text-ink-muted hover:text-ink"
      >
        ← {tCommon('backToWork')}
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="font-mono text-lg uppercase tracking-label">
          {p.title.en}
        </h1>
        <p className="text-sm text-ink-muted">
          {pick(p.title, locale)} · {locale === 'en' ? p.category.name.en : p.category.name.ko}
        </p>
      </div>

      {p.coverImageUrl ? (
        <div className="relative mt-6 aspect-[16/10] w-full bg-line">
          <Image
            src={p.coverImageUrl}
            alt={pick(p.title, locale)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_18rem] md:gap-16">
        <RichHtml html={pick(p.description, locale)} className="max-w-prose" />
        <dl className="h-max border-t border-line md:sticky md:top-20">
          {meta.map(([k, v]) =>
            v ? (
              <div
                key={k}
                className="flex justify-between gap-4 border-b border-line py-2.5"
              >
                <dt className="font-mono text-[0.68rem] uppercase tracking-label text-ink-muted">
                  {k}
                </dt>
                <dd className="text-right text-xs text-ink-soft">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
      </div>

      {p.media.length > 0 ? (
        <div className="mt-14 space-y-4">
          {p.media.map((m) =>
            m.type === 'VIDEO' ? (
              <video
                key={m.id}
                controls
                playsInline
                preload="metadata"
                poster={m.posterUrl ?? undefined}
                className="w-full bg-line"
              >
                <source src={m.url} />
              </video>
            ) : (
              <div key={m.id} className="relative aspect-[16/10] w-full bg-line">
                <Image
                  src={m.url}
                  alt={m.alt ?? pick(p.title, locale)}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ),
          )}
        </div>
      ) : null}
    </Container>
  );
}
