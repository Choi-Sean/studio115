import { useTranslations } from 'next-intl';

const STEP_KEYS = ['1', '2', '3', '4', '5', '6', '7'] as const;

export function ProcessList() {
  const t = useTranslations('process.steps');

  return (
    <ol className="border-t border-line">
      {STEP_KEYS.map((k) => {
        const note = t(`${k}.note`);
        return (
          <li
            key={k}
            id={`step-${k}`}
            className="grid gap-2 border-b border-line py-7 sm:grid-cols-[3rem_1fr] sm:gap-8 md:grid-cols-[3rem_16rem_1fr]"
          >
            <span className="font-mono text-xs text-ink-muted">
              {k.padStart(2, '0')}
            </span>
            <h3 className="font-medium">
              {t(`${k}.title`)}
              {note ? (
                <span className="ml-2 font-mono text-[0.7rem] uppercase tracking-label text-ink-muted">
                  {note}
                </span>
              ) : null}
            </h3>
            <p className="max-w-prose text-sm leading-relaxed text-ink-soft">
              {t(`${k}.body`)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
