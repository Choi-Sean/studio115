// Custom next/image loader. With no CDN configured it returns the source URL
// untouched (dev / picsum). Point NEXT_PUBLIC_IMAGE_CDN at your image CDN to
// enable on-the-fly resizing without touching Vercel's image quota.
//
//  - Bunny Optimizer / generic:  <cdn>/<path>?width=..&quality=..&format=auto
//  - Cloudflare Images:          <cdn>/cdn-cgi/image/width=..,quality=../<src>
//
// Adjust the return below to match the provider you choose.

type LoaderArgs = { src: string; width: number; quality?: number };

const CDN = (process.env.NEXT_PUBLIC_IMAGE_CDN ?? '').replace(/\/$/, '');

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (!CDN) return src;

  const path = src.replace(/^https?:\/\/[^/]+/, '');
  const u = new URL(CDN + path);
  u.searchParams.set('width', String(width));
  u.searchParams.set('quality', String(quality ?? 72));
  u.searchParams.set('format', 'auto');
  return u.toString();
}
