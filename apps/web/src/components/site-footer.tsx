import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [t, tn] = await Promise.all([
    getTranslations('footer'),
    getTranslations('nav'),
  ]);

  const name = settings['company.name'] ?? 'Studio115';
  const email = settings['contact.email'];
  const phone = settings['contact.phone'];
  const insta = settings['social.instagram'];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg">{name}</p>
          <p className="mt-2 text-sm text-ink-muted">{t('tagline')}</p>
        </div>

        <div>
          <p className="u-kicker mb-3">{t('sitemap')}</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href="/projects" className="hover:text-ink">{tn('projects')}</Link></li>
            <li><Link href="/services" className="hover:text-ink">{tn('services')}</Link></li>
            <li><Link href="/about" className="hover:text-ink">{tn('about')}</Link></li>
            <li><Link href="/contact" className="hover:text-ink">{tn('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="u-kicker mb-3">{t('contact')}</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="hover:text-ink">{email}</a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-ink">
                  {phone}
                </a>
              </li>
            ) : null}
            {insta ? (
              <li>
                <a href={insta} target="_blank" rel="noreferrer" className="hover:text-ink">
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-6 text-xs text-ink-muted lg:px-8">
          © {year} {name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
