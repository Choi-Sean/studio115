'use client';

import { cn } from '@/lib/utils';

export const inputCls =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 disabled:bg-neutral-100';

export function Label({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-1 block text-xs font-medium text-neutral-600">
      {children}
      {hint ? <span className="ml-1 font-normal text-neutral-400">{hint}</span> : null}
    </label>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label hint={hint}>
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

export function Input(props: React.ComponentProps<'input'>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Textarea(props: React.ComponentProps<'textarea'>) {
  return (
    <textarea {...props} className={cn(inputCls, 'min-h-24 resize-y', props.className)} />
  );
}

export function Select(props: React.ComponentProps<'select'>) {
  return <select {...props} className={cn(inputCls, props.className)} />;
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const styles = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
    ghost: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100',
    danger: 'border border-red-300 text-red-600 hover:bg-red-50',
  }[variant];
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        styles,
        className,
      )}
    />
  );
}

export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
