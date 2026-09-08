import type {
  InstagramMediaDto,
  Paginated,
  ProjectDto,
  ServiceDto,
} from '@studio115/shared';
import { API_URL } from './env';
import {
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from './fallback';

const REVALIDATE = 60;

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[api] GET ${path} → fallback (${(err as Error).message})`);
    }
    return fallback;
  }
}

export function getProjects(params?: {
  category?: string;
  featured?: boolean;
  pageSize?: number;
}): Promise<Paginated<ProjectDto>> {
  const pageSize = params?.pageSize ?? 24;
  const qs = new URLSearchParams({ pageSize: String(pageSize) });
  if (params?.category) qs.set('category', params.category);
  if (params?.featured) qs.set('featured', 'true');

  const filtered = FALLBACK_PROJECTS.filter(
    (p) =>
      (!params?.category || p.category === params.category) &&
      (!params?.featured || p.featured),
  ).slice(0, pageSize);

  return get<Paginated<ProjectDto>>(`/projects?${qs.toString()}`, {
    items: filtered,
    total: filtered.length,
    page: 1,
    pageSize: Math.max(filtered.length, 1),
    totalPages: 1,
  });
}

export async function getProject(slug: string): Promise<ProjectDto | null> {
  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
  try {
    const res = await fetch(`${API_URL}/api/projects/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE },
    });
    if (res.status === 404) return fallback;
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as ProjectDto;
  } catch {
    return fallback;
  }
}

export function getServices(): Promise<ServiceDto[]> {
  return get<ServiceDto[]>('/services', FALLBACK_SERVICES);
}

export function getSettings(): Promise<Record<string, string>> {
  return get<Record<string, string>>('/settings', FALLBACK_SETTINGS);
}

export function getInstagram(): Promise<InstagramMediaDto[]> {
  return get<InstagramMediaDto[]>('/instagram', []);
}
