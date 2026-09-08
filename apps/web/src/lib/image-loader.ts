// Custom next/image loader. With no CDN configured it returns the source URL
// untouched (dev / picsum). Point NEXT_PUBLIC_IMAGE_CDN at the R2 bucket's
// public domain to serve images from Cloudflare instead of Vercel's quota.
//
// NEXT_PUBLIC_IMAGE_CDN_MODE:
//   cloudflare  -> <cdn>/cdn-cgi/image/width=..,quality=..,format=auto/<path>
//                  (requires Transformations enabled on the Cloudflare zone)
//   query       -> <cdn>/<path>?width=..&quality=..&format=auto
//   passthrough -> <cdn>/<path>  (originals, unresized)

type LoaderArgs = { src: string; width: number; quality?: number };

const CDN = (process.env.NEXT_PUBLIC_IMAGE_CDN ?? '').replace(/\/$/, '');
const MODE = process.env.NEXT_PUBLIC_IMAGE_CDN_MODE ?? 'cloudflare';

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (!CDN) return src;

  // Path on the CDN host. If `src` is already absolute, keep only its path.
  const path = src.startsWith('http') ? src.replace(/^https?:\/\/[^/]+/, '') : `/${src.replace(/^\//, '')}`;
  const q = quality ?? 72;

  if (MODE === 'cloudflare') {
    return `${CDN}/cdn-cgi/image/width=${width},quality=${q},format=auto${path}`;
  }
  if (MODE === 'query') {
    const u = new URL(CDN + path);
    u.searchParams.set('width', String(width));
    u.searchParams.set('quality', String(q));
    u.searchParams.set('format', 'auto');
    return u.toString();
  }
  return `${CDN}${path}`;
}
