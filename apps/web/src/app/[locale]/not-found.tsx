import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-4xl">404</p>
      <h1 className="mt-4 text-lg">{t('title')}</h1>
      <p className="mt-2 text-sm text-ink-muted">{t('body')}</p>
      <Link
        href="/"
        className="mt-8 border border-ink px-5 py-2 font-mono text-xs uppercase tracking-label transition-colors hover:bg-ink hover:text-paper"
      >
        {t('home')}
      </Link>
    </section>
  );
}
