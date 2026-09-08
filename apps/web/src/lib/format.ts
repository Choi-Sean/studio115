import type { LocalizedText } from '@studio115/shared';

/** Choose the field for the active locale, falling back to the other. */
export function pick(text: LocalizedText | undefined, locale: string): string {
  if (!text) return '';
  return locale === 'en' ? text.en || text.ko : text.ko || text.en;
}

export function formatArea(sqm: number | null, locale: string): string | null {
  if (sqm == null) return null;
  if (locale === 'en') return `${sqm.toLocaleString('en-US')} ㎡`;
  const pyeong = Math.round(sqm / 3.3058);
  return `${sqm.toLocaleString('ko-KR')} ㎡ · 약 ${pyeong}평`;
}
