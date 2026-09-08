import { getTranslations } from 'next-intl/server';

export async function FloatingActions({
  phone,
  instagram,
}: {
  phone?: string;
  instagram?: string;
}) {
  const t = await getTranslations('common');
  const tel = phone ? phone.replace(/[^0-9+]/g, '') : '';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
      {phone ? (
        <a
          href={`tel:${tel}`}
          aria-label={t('call')}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-transform hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z" />
          </svg>
        </a>
      ) : null}
      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noreferrer"
          aria-label={t('instagram')}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-transform hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
