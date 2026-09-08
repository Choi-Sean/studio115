import { cn } from '@/lib/utils';

export function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1280px] px-5 lg:px-8', className)}
      {...props}
    />
  );
}
