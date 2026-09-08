import { Container } from './container';
import { getInstagram, getSettings } from '@/lib/api';

export async function InstagramFeed() {
  const [items, settings] = await Promise.all([getInstagram(), getSettings()]);
  if (items.length === 0) return null;

  const handleUrl = settings['social.instagram'] ?? '';
  const handle = handleUrl.replace(/\/+$/, '').split('/').pop();
  const five = items.slice(0, 5);

  return (
    <Container className="mt-24">
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-8">
        <p className="u-label">Instagram</p>
        {handleUrl ? (
          <a
            href={handleUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-ink-muted hover:text-ink"
          >
            @{handle} ↗
          </a>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {five.map((m) => (
          <a
            key={m.id}
            href={m.permalink}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square overflow-hidden bg-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.imageUrl}
              alt={m.caption ?? ''}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </Container>
  );
}
