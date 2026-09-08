import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { slugify, slugifyInput } from '@studio115/shared';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
