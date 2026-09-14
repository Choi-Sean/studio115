import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  const rows: Array<[string, string | undefined]> = [
    [t('legal.company'), settings['legal.bizName']],
    [t('legal.owner'), settings['legal.owner']],
    [t('legal.address'), settings['legal.address']],
    [t('legal.phone'), settings['legal.phone']],
    [t('legal.email'), settings['legal.email']],
    [t('legal.bizNumber'), settings['legal.bizNumber']],
    [t('legal.mailOrder'), settings['legal.mailOrderNumber']],
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Studio115"
          className="mb-6 h-5 w-auto opacity-60"
        />
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-label text-ink">
          <Link href="/terms" className="u-underline">
            {t('terms')}
          </Link>
          <Link href="/privacy" className="u-underline">
            {t('privacy')}
          </Link>
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-1.5 text-[0.72rem] leading-relaxed text-ink-muted sm:grid-cols-2 lg:grid-cols-4">
          {rows.map(([label, value]) =>
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
