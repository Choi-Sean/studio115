/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@studio115/shared'],
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  // Type-checking runs as its own step (`pnpm typecheck`) — keep it out of the
  // build so `next build` doesn't spawn a memory-heavy tsc worker.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
