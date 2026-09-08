const strip = (v: string | undefined) => (v ?? '').replace(/\/$/, '');

export const API_URL = strip(process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:4000';
export const SITE_URL = strip(process.env.NEXT_PUBLIC_SITE_URL) || 'http://localhost:3000';
export const IMAGE_CDN = strip(process.env.NEXT_PUBLIC_IMAGE_CDN);
