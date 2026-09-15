import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { InstagramIcon } from './icons';

export async function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  // Row 1: identity — company / owner / address, fixed 3 across.
  const primaryRows: Array<[string, string | undefined]> = [
    [t('legal.company'), settings['legal.bizName']],
    [t('legal.owner'), settings['legal.owner']],
    [t('legal.address'), settings['legal.address']],
  ];
  // Row 2: contact / registration details, dropped below.
  const secondaryRows: Array<[string, string | undefined]> = [
    [t('legal.phone'), settings['legal.phone']],
    [t('legal.email'), settings['legal.email']],
    [t('legal.bizNumber'), settings['legal.bizNumber']],
    [t('legal.mailOrder'), settings['legal.mailOrderNumber']],
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Studio115"
          className="mb-6 h-5 w-auto opacity-60"
        />
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-label text-ink">
            <Link href="/terms" className="u-underline">
              {t('terms')}
            </Link>
            <Link href="/privacy" className="u-underline">
              {t('privacy')}
            </Link>
          </div>
          {settings['social.instagram'] ? (
            <a
              href={settings['social.instagram']}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          ) : null}
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-1.5 text-[0.72rem] leading-relaxed text-ink-muted sm:grid-cols-3">
          {primaryRows.map(([label, value]) =>
            value ? (
              <div key={label} className="flex gap-2">
                <dt className="shrink-0 font-mono uppercase tracking-label">
                  {label}
                </dt>
                <dd className="text-ink-soft">{value}</dd>
              </div>
            ) : null,
          )}
        </dl>

        <dl className="mt-1.5 grid gap-x-8 gap-y-1.5 text-[0.72rem] leading-relaxed text-ink-muted sm:grid-cols-3">
          {secondaryRows.map(([label, value]) =>
            value ? (
              <div key={label} className="flex gap-2">
                <dt className="shrink-0 font-mono uppercase tracking-label">
                  {label}
                </dt>
                <dd className="text-ink-soft">
                  {label === t('legal.email') ? (
                    <a href={`mailto:${value}`} className="u-underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ) : null,
          )}
        </dl>

        {settings['footer.notice'] ? (
          <p className="mt-6 text-[0.72rem] text-ink-muted">
            {settings['footer.notice']}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.68rem] uppercase tracking-label text-ink-muted">
          <p>
            © {year} Studio115. {t('rights')}
          </p>
          <a
            href="https://www.linkedin.com/in/sean1991/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Powered by Sean
          </a>
        </div>
      </div>
    </footer>
  );
}
