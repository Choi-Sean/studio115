import { Injectable, Logger } from '@nestjs/common';
import type { InstagramMediaDto } from '@studio115/shared';

type CacheEntry = { at: number; data: InstagramMediaDto[] };

@Injectable()
export class InstagramService {
  private readonly log = new Logger(InstagramService.name);
  private readonly ttlMs = 15 * 60 * 1000;
  private readonly limit = 12;
  private cache: CacheEntry | null = null;

  async getFeed(): Promise<InstagramMediaDto[]> {
    if (this.cache && Date.now() - this.cache.at < this.ttlMs) {
      return this.cache.data;
    }
    let data: InstagramMediaDto[];
    try {
      data = await this.fetchFeed();
    } catch (err) {
      this.log.warn(`feed fetch failed: ${(err as Error).message}`);
      data = this.cache?.data ?? [];
    }
    this.cache = { at: Date.now(), data };
    return data;
  }

  private async fetchFeed(): Promise<InstagramMediaDto[]> {
    const provider = (process.env.INSTAGRAM_PROVIDER ?? '').toLowerCase();
    if (provider === 'behold') return this.fromBehold();
    if (provider === 'graph') return this.fromGraph();
    return [];
  }

  private async fromBehold(): Promise<InstagramMediaDto[]> {
    const url = process.env.BEHOLD_FEED_URL;
    if (!url) return [];
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`behold ${res.status}`);
    const json: unknown = await res.json();
    const posts: any[] = Array.isArray(json)
      ? json
      : ((json as { posts?: unknown[] }).posts ?? []);
    return posts.slice(0, this.limit).map((p) => ({
      id: String(p.id),
      caption: p.caption ?? p.prompt ?? null,
      permalink: p.permalink,
      mediaType: (p.mediaType ?? 'IMAGE') as InstagramMediaDto['mediaType'],
      imageUrl:
        p.sizes?.medium?.mediaUrl ??
        p.sizes?.large?.mediaUrl ??
        p.thumbnailUrl ??
        p.mediaUrl,
      timestamp: p.timestamp ?? null,
    }));
  }

  private async fromGraph(): Promise<InstagramMediaDto[]> {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) return [];
    const fields =
      'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=${this.limit}&access_token=${token}`,
    );
    if (!res.ok) throw new Error(`graph ${res.status}`);
    const json = (await res.json()) as { data?: any[] };
    return (json.data ?? []).map((m) => ({
      id: String(m.id),
      caption: m.caption ?? null,
      permalink: m.permalink,
      mediaType: m.media_type as InstagramMediaDto['mediaType'],
      imageUrl: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
      timestamp: m.timestamp ?? null,
    }));
  }
}
