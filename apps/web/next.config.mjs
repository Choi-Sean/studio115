import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Only route images through the custom loader when an image CDN is configured.
// Without one (local dev), fall back to Next's built-in optimizer.
const imageCdn = process.env.NEXT_PUBLIC_IMAGE_CDN?.trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@studio115/shared'],
  images: {
    ...(imageCdn
      ? { loader: 'custom', loaderFile: './src/lib/image-loader.ts' }
      : {}),
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  // Type-checking runs as its own step (`pnpm typecheck`) — keep it out of the
  // build so `next build` doesn't spawn a memory-heavy tsc worker.
  typescript: { ignoreBuildErrors: true },
};

export default withNextIntl(nextConfig);
