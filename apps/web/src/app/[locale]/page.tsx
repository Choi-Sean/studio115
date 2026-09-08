import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { ProjectCard } from '@/components/project-card';
import { ServiceIcon } from '@/components/service-icon';
import { getProjects, getServices, getSettings } from '@/lib/api';
import { pick } from '@/lib/format';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tcta, featured, services, settings] = await Promise.all([
    getTranslations('home'),
    getTranslations('cta'),
    getProjects({ featured: true, pageSize: 3 }),
    getServices(),
    getSettings(),
  ]);

  const hero = featured.items[0]?.coverImageUrl;
  const stat = (k: string) => settings[`stats.${k}`] ?? '—';

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="u-kicker">{t('heroKicker')}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-prose text-ink-soft">{t('heroBody')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-full bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
              >
                {tcta('viewProjects')}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-ink px-6 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
              >
                {tcta('inquiry')}
              </Link>
            </div>
          </div>
          {hero ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-line md:aspect-[4/3]">
              <Image
                src={hero}
                alt=""
                fill
                priority
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </section>

      {/* Featured projects */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading kicker={t('featuredKicker')} title={t('featuredTitle')} />
            <Link
              href="/projects"
              className="hidden shrink-0 text-sm text-ink-soft hover:text-ink md:inline"
            >
              {tcta('viewAll')} →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.items.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i === 0} />
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="border-y border-line bg-white/30 py-16 md:py-24">
        <Container>
          <SectionHeading
            kicker={t('servicesKicker')}
            title={t('servicesTitle')}
          >
            {t('servicesBody')}
          </SectionHeading>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="border-t border-line pt-5">
                <ServiceIcon name={s.icon} className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-display text-lg">
                  {pick(s.title, locale)}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {pick(s.description, locale)}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/services"
            className="mt-10 inline-block text-sm text-ink-soft hover:text-ink"
          >
            {tcta('readMore')} →
          </Link>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <Container className="grid grid-cols-3 gap-6 text-center">
          {[
            { key: 'projects', label: t('statsProjects') },
            { key: 'years', label: t('statsYears') },
            { key: 'awards', label: t('statsAwards') },
          ].map((s) => (
            <div key={s.key}>
              <p className="font-display text-3xl sm:text-4xl">{stat(s.key)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-muted">
                {s.label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-paper md:py-20">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl">{t('ctaTitle')}</h2>
            <p className="mt-3 max-w-prose text-paper/70">{t('ctaBody')}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full border border-paper px-6 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-paper hover:text-ink"
          >
            {tcta('inquiry')}
          </Link>
        </Container>
      </section>
    </>
  );
}
