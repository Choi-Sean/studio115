// Minimal sanitize for admin-authored rich HTML. Content comes only from
// authenticated ADMIN/EDITOR users, so this just removes the obvious script
// vectors. Swap in a full sanitizer (sanitize-html / DOMPurify) if untrusted
// authors are ever added.
export function sanitizeRichHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\s*(script|style|iframe)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe)[^>]*\/?\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')?\s*javascript:[^"'>\s]*/gi, '$1="#"');
}
