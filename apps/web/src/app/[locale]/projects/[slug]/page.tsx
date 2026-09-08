import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/container';
import { Link } from '@/i18n/navigation';
import { getProject } from '@/lib/api';
import { formatArea, pick } from '@/lib/format';

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
    title: pick(p.title, locale),
    description: pick(p.summary, locale),
    openGraph: p.coverImageUrl ? { images: [p.coverImageUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tc, p] = await Promise.all([
    getTranslations('projects'),
    getTranslations('cta'),
    getProject(slug),
  ]);
  if (!p) notFound();

  const body = pick(p.description, locale)
    .split(/\n{2,}/)
    .filter(Boolean);

  const meta: Array<[string, string | null]> = [
    [t('meta.category'), t(`category.${p.category}`)],
    [t('meta.location'), p.location],
    [t('meta.area'), formatArea(p.areaSqm, locale)],
    [t('meta.year'), p.year ? String(p.year) : null],
  ];

  return (
    <article className="py-12 md:py-16">
      <Container>
        <Link href="/projects" className="text-sm text-ink-soft hover:text-ink">
          ← {tc('backToProjects')}
        </Link>

        <header className="mt-6 max-w-prose">
          <p className="u-kicker">{t(`category.${p.category}`)}</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">
            {pick(p.title, locale)}
          </h1>
          <p className="mt-4 text-ink-soft">{pick(p.summary, locale)}</p>
        </header>
      </Container>

      {p.coverImageUrl ? (
        <div className="relative mt-10 aspect-[16/9] w-full bg-line">
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

      <Container className="mt-12 grid gap-10 md:grid-cols-[1fr_16rem] md:gap-16">
        <div className="u-prose max-w-prose">
          {body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <dl className="h-max border-t border-line text-sm md:sticky md:top-24">
          {meta.map(([k, v]) =>
            v ? (
              <div
                key={k}
                className="flex justify-between gap-4 border-b border-line py-3"
              >
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
      </Container>

      {p.images.length > 0 ? (
        <Container className="mt-14 grid gap-4 sm:grid-cols-2">
          {p.images.map((img, i) => (
            <div
              key={img.id}
              className={
                i % 3 === 0
                  ? 'relative aspect-[16/10] bg-line sm:col-span-2'
                  : 'relative aspect-[4/3] bg-line'
              }
            >
              <Image
                src={img.url}
                alt={img.alt ?? pick(p.title, locale)}
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </Container>
      ) : null}
    </article>
  );
}
