import { sanitizeRichHtml } from '@/lib/rich-html';
import { cn } from '@/lib/utils';

export function RichHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn('rich', className)}
      dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }}
    />
  );
}
