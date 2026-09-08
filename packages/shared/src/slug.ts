export interface SlugifyOptions {
  /** Trim to this many chars at a word boundary. Default 60 (SEO-friendly). */
  maxLength?: number;
}

const SYMBOL_WORDS: Record<string, string> = {
  '&': ' and ',
  '@': ' at ',
  '%': ' percent ',
  '+': ' plus ',
  '₩': ' won ', // ₩
  $: ' dollar ',
  '€': ' euro ', // €
  '£': ' pound ', // £
  '#': ' number ',
};

const DIACRITICS = /[̀-ͯ]/g;
const SYMBOLS = /[&@%+₩$€£#]/g;

/**
 * SEO-friendly slug: lowercase, ASCII only, words joined by single hyphens,
 * accents flattened (é->e), common symbols spelled out (&->and), trimmed to a
 * word boundary. Non-latin input (e.g. Korean) yields "" — slugs are meant to
 * be written from the English title.
 */
export function slugify(input: string, opts: SlugifyOptions = {}): string {
  const maxLength = opts.maxLength ?? 60;

  let s = (input ?? '').toString().trim();
  s = s.replace(SYMBOLS, (m) => SYMBOL_WORDS[m] ?? ' ');
  s = s.normalize('NFKD').replace(DIACRITICS, '');
  s = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (s.length > maxLength) {
    const cut = s.slice(0, maxLength);
    const lastDash = cut.lastIndexOf('-');
    s = lastDash > 0 ? cut.slice(0, lastDash) : cut;
  }
  return s;
}

/**
 * Same, but keeps a single trailing hyphen while the user is still typing in a
 * text field (so "grid " -> "grid-" and the next word can be appended).
 */
export function slugifyInput(input: string): string {
  const base = slugify(input);
  const endsWithSeparator = /[\s\-_/]$/.test(input ?? '');
  return endsWithSeparator && base ? `${base}-` : base;
}
