import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Studio115"
      className={cn('h-5 w-auto', className)}
    />
  );
}
