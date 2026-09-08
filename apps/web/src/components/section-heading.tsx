import { cn } from '@/lib/utils';

export function SectionHeading({
  kicker,
  title,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('max-w-prose', className)}>
      {kicker ? <p className="u-kicker mb-3">{kicker}</p> : null}
      <h2 className="text-2xl leading-tight sm:text-3xl md:text-[2.5rem]">
        {title}
      </h2>
      {children ? <p className="mt-4 text-ink-soft">{children}</p> : null}
    </div>
  );
}
