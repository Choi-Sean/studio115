import { cn } from '@/lib/utils';

export function Logo({
  className,
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Studio115" className="h-5 w-auto" />
      {wordmark ? (
        <span className="whitespace-nowrap font-mono text-[0.8rem] font-medium uppercase tracking-[0.3em] text-ink-soft">
          Studio IIO
        </span>
      ) : null}
    </span>
  );
}
