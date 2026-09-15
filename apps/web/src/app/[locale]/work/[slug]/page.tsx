import type { Metadata } from 'next';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ProjectMediaDto } from '@studio115/shared';
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

// Mobile: simple full width, natural height, never cropped. Desktop: every
// image is capped to the viewport height so each one is fully visible on
// one screen — width scales down with it (never cropped), so a tall
// portrait shrinks instead of running past the fold.
const MEDIA_CLASS =
  'block w-full bg-paper md:mx-auto md:h-auto md:w-auto md:max-w-full md:max-h-[80vh]';

function Media({
  media,
  alt,
  priority,
}: {
  media: ProjectMediaDto;
  alt: string;
  priority?: boolean;
}) {
  if (media.type === 'VIDEO') {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={media.posterUrl ?? undefined}
        className={MEDIA_CLASS}
      >
        <source src={media.url} />
      </video>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.url}
      alt={media.alt ?? alt}
      loading={priority ? 'eager' : 'lazy'}
      className={MEDIA_CLASS}
    />
  );
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

  // Fall back to the cover image alone if no media rows were ever added.
  const items: ProjectMediaDto[] =
    p.media.length > 0
      ? p.media
      : p.coverImageUrl
        ? [{ id: 'cover', type: 'IMAGE', url: p.coverImageUrl, posterUrl: null, alt: null, order: 0 }]
        : [];

  const infoPanel = (
    <dl className="border-t border-line">
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
  );

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

      {pick(p.description, locale) ? (
        <RichHtml html={pick(p.description, locale)} className="mt-8 max-w-prose" />
      ) : null}

      {/* Desktop: images left (60%), spec sheet sticky on the right (40%).
          Mobile: images stack full-width, spec sheet right after the first one. */}
      <div className="mt-10 md:grid md:grid-cols-[3fr_2fr] md:items-start md:gap-16">
        <div className="space-y-4">
          {items.length === 0 ? <div className="md:hidden">{infoPanel}</div> : null}
          {items.map((m, i) => (
            <Fragment key={m.id}>
              <Media media={m} alt={pick(p.title, locale)} priority={i === 0} />
              {i === 0 ? <div className="md:hidden">{infoPanel}</div> : null}
            </Fragment>
          ))}
        </div>

        <div className="mt-10 md:sticky md:top-20 md:mt-0 md:block hidden">
          {infoPanel}
        </div>
      </div>
    </Container>
  );
}
