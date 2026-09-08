import { cn } from '@/lib/utils';

export function SectionHeading({
  label,
  title,
  children,
  className,
}: {
  label?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('', className)}>
      {label ? <p className="u-label">{label}</p> : null}
      {title ? (
        <h1 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">
          {title}
        </h1>
      ) : null}
      {children ? (
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {children}
        </p>
      ) : null}
    </div>
  );
}
