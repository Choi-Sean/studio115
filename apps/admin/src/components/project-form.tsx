'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECT_CATEGORIES, type ProjectDto } from '@studio115/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { slugify } from '@/lib/utils';
import { Button, Field, Input, Select, Textarea } from './ui';

type ImageRow = { url: string; alt: string };

const CAT_KO: Record<string, string> = {
  RESIDENTIAL: '주거',
  COMMERCIAL: '상업',
  OFFICE: '오피스',
  HOSPITALITY: '호스피탈리티',
  RETAIL: '리테일',
};

export function ProjectForm({ initial }: { initial?: ProjectDto }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [images, setImages] = useState<ImageRow[]>(
    initial?.images.map((i) => ({ url: i.url, alt: i.alt ?? '' })) ?? [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const n = (k: string) => (fd.get(k) ? Number(fd.get(k)) : undefined);

    const body = {
      slug: slug || slugify(s('titleEn')),
      titleKo: s('titleKo'),
      titleEn: s('titleEn'),
      summaryKo: s('summaryKo'),
      summaryEn: s('summaryEn'),
      descriptionKo: s('descriptionKo'),
      descriptionEn: s('descriptionEn'),
      category: s('category'),
      type: s('type') || undefined,
      location: s('location') || undefined,
      sizeLabel: s('sizeLabel') || undefined,
      involvement: s('involvement') || undefined,
      completionDate: s('completionDate') || undefined,
      photography: s('photography') || undefined,
      areaSqm: n('areaSqm'),
      year: n('year'),
      coverImageUrl: s('coverImageUrl') || images[0]?.url || undefined,
      featured: fd.get('featured') === 'on',
      published: fd.get('published') === 'on',
      order: n('order') ?? 0,
      images: images
        .filter((i) => i.url.trim())
        .map((i, idx) => ({ url: i.url.trim(), alt: i.alt.trim() || undefined, order: idx })),
    };

    setBusy(true);
    setError('');
    try {
      if (editing) {
        await apiFetch(`/admin/projects/${initial!.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/admin/projects', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      router.push('/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, 'projects');
        setImages((prev) => [...prev, { url, alt: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="제목 (KO)">
          <Input name="titleKo" required defaultValue={initial?.title.ko} />
        </Field>
        <Field label="Title (EN)">
          <Input
            name="titleEn"
            required
            defaultValue={initial?.title.en}
            onChange={(e) => {
              if (!editing && !slug) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="슬러그" hint="URL 경로">
          <Input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            required
          />
        </Field>
        <Field label="카테고리">
          <Select name="category" defaultValue={initial?.category ?? 'RESIDENTIAL'}>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CAT_KO[c] ?? c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="요약 (KO)">
          <Textarea name="summaryKo" required defaultValue={initial?.summary.ko} />
        </Field>
        <Field label="Summary (EN)">
          <Textarea name="summaryEn" required defaultValue={initial?.summary.en} />
        </Field>
        <Field label="본문 (KO)">
          <Textarea
            name="descriptionKo"
            required
            className="min-h-40"
            defaultValue={initial?.description.ko}
          />
        </Field>
        <Field label="Body (EN)">
          <Textarea
            name="descriptionEn"
            required
            className="min-h-40"
            defaultValue={initial?.description.en}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="TYPE" hint="예: Residence, Cafe">
          <Input name="type" defaultValue={initial?.type ?? ''} />
        </Field>
        <Field label="LOCATION">
          <Input name="location" defaultValue={initial?.location ?? ''} />
        </Field>
        <Field label="SIZE" hint="예: 122 m²">
          <Input name="sizeLabel" defaultValue={initial?.sizeLabel ?? ''} />
        </Field>
        <Field label="INVOLVEMENT" hint="예: Design, Construction">
          <Input name="involvement" defaultValue={initial?.involvement ?? ''} />
        </Field>
        <Field label="DATE OF COMPLETION" hint="예: 12.2023">
          <Input name="completionDate" defaultValue={initial?.completionDate ?? ''} />
        </Field>
        <Field label="PHOTOGRAPHY">
          <Input name="photography" defaultValue={initial?.photography ?? ''} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="면적 (㎡)" hint="숫자만">
          <Input name="areaSqm" type="number" step="0.1" defaultValue={initial?.areaSqm ?? ''} />
        </Field>
        <Field label="연도">
          <Input name="year" type="number" defaultValue={initial?.year ?? ''} />
        </Field>
        <Field label="정렬" hint="낮을수록 먼저">
          <Input name="order" type="number" defaultValue={initial?.order ?? 0} />
        </Field>
      </div>

      {/* Images */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-600">이미지</p>
          <label className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100">
            {uploading ? '업로드 중…' : '파일 추가'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
        </div>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs text-neutral-400">{i + 1}</span>
              <Input
                value={img.url}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((p, j) => (j === i ? { ...p, url: e.target.value } : p)),
                  )
                }
                placeholder="https://…"
              />
              <Input
                value={img.alt}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((p, j) => (j === i ? { ...p, alt: e.target.value } : p)),
                  )
                }
                placeholder="alt"
                className="max-w-40"
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
              >
                ✕
              </Button>
            </div>
          ))}
          {images.length === 0 ? (
            <p className="text-sm text-neutral-400">첫 번째 이미지가 커버로 사용됩니다.</p>
          ) : null}
        </div>
        <Field label="커버 이미지 URL (선택)">
          <Input
            name="coverImageUrl"
            defaultValue={initial?.coverImageUrl ?? ''}
            placeholder="비우면 첫 이미지 사용"
          />
        </Field>
      </div>

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} />
          공개
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} />
          대표 프로젝트
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? '저장 중…' : editing ? '변경 저장' : '프로젝트 생성'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
