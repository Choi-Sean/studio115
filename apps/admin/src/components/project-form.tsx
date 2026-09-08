'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CategoryDto, ProjectDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { uploadMedia } from '@/lib/upload';
import { slugify } from '@/lib/utils';
import { RichEditor } from './rich-editor';
import { Button, Field, Input, Select } from './ui';

type MediaRow = {
  type: 'IMAGE' | 'VIDEO';
  url: string;
  posterUrl: string;
  alt: string;
};

export function ProjectForm({ initial }: { initial?: ProjectDto }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const { data: categories } = useApi<CategoryDto[]>('/categories');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category.id ?? '');
  const [descKo, setDescKo] = useState(initial?.description.ko ?? '');
  const [descEn, setDescEn] = useState(initial?.description.en ?? '');
  const [media, setMedia] = useState<MediaRow[]>(
    initial?.media.map((m) => ({
      type: m.type,
      url: m.url,
      posterUrl: m.posterUrl ?? '',
      alt: m.alt ?? '',
    })) ?? [],
  );

  const catOptions = useMemo(
    () => categories ?? (initial ? [{ ...initial.category, order: 0 }] : []),
    [categories, initial],
  );

  function patchMedia(i: number, patch: Partial<MediaRow>) {
    setMedia((prev) => prev.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const n = (k: string) => (fd.get(k) ? Number(fd.get(k)) : undefined);

    if (!categoryId) {
      setError('카테고리를 선택하세요.');
      return;
    }

    const body = {
      slug: slug || slugify(s('titleEn')),
      titleKo: s('titleKo'),
      titleEn: s('titleEn'),
      summaryKo: s('summaryKo'),
      summaryEn: s('summaryEn'),
      descriptionKo: descKo,
      descriptionEn: descEn,
      categoryId,
      type: s('type') || undefined,
      location: s('location') || undefined,
      sizeLabel: s('sizeLabel') || undefined,
      involvement: s('involvement') || undefined,
      completionDate: s('completionDate') || undefined,
      photography: s('photography') || undefined,
      areaSqm: n('areaSqm'),
      year: n('year'),
      coverImageUrl:
        s('coverImageUrl') ||
        media.find((m) => m.type === 'IMAGE')?.url ||
        undefined,
      featured: fd.get('featured') === 'on',
      published: fd.get('published') === 'on',
      order: n('order') ?? 0,
      media: media
        .filter((m) => m.url.trim())
        .map((m, i) => ({
          type: m.type,
          url: m.url.trim(),
          posterUrl: m.posterUrl.trim() || undefined,
          alt: m.alt.trim() || undefined,
          order: i,
        })),
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
        const m = await uploadMedia(file, 'projects');
        setMedia((prev) => [
          ...prev,
          { type: m.type, url: m.url, posterUrl: '', alt: '' },
        ]);
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
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              선택…
            </option>
            {catOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.ko} · {c.name.en}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="요약 (KO)">
          <Input name="summaryKo" required defaultValue={initial?.summary.ko} />
        </Field>
        <Field label="Summary (EN)">
          <Input name="summaryEn" required defaultValue={initial?.summary.en} />
        </Field>
      </div>

      <Field label="본문 (KO)">
        <RichEditor value={descKo} onChange={setDescKo} prefix="projects" />
      </Field>
      <Field label="Body (EN)">
        <RichEditor value={descEn} onChange={setDescEn} prefix="projects" />
      </Field>

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

      {/* Media */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-600">
            이미지 / 영상 <span className="text-neutral-400">(첫 이미지가 커버)</span>
          </p>
          <label className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100">
            {uploading ? '업로드 중…' : '파일 추가'}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void onFiles(e.target.files);
                e.currentTarget.value = '';
              }}
            />
          </label>
        </div>

        <div className="space-y-3">
          {media.map((m, i) => (
            <div
              key={i}
              className="rounded-md border border-neutral-200 bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-center text-xs text-neutral-400">
                  {i + 1}
                </span>
                <Select
                  value={m.type}
                  onChange={(e) =>
                    patchMedia(i, { type: e.target.value as MediaRow['type'] })
                  }
                  className="max-w-28"
                >
                  <option value="IMAGE">이미지</option>
                  <option value="VIDEO">영상</option>
                </Select>
                <Input
                  value={m.url}
                  onChange={(e) => patchMedia(i, { url: e.target.value })}
                  placeholder="https://…"
                />
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setMedia((p) => p.filter((_, j) => j !== i))}
                >
                  ✕
                </Button>
              </div>
              <div className="mt-2 flex gap-2 pl-7">
                <Input
                  value={m.alt}
                  onChange={(e) => patchMedia(i, { alt: e.target.value })}
                  placeholder="alt 텍스트"
                />
                {m.type === 'VIDEO' ? (
                  <Input
                    value={m.posterUrl}
                    onChange={(e) => patchMedia(i, { posterUrl: e.target.value })}
                    placeholder="포스터 이미지 URL (선택)"
                  />
                ) : null}
              </div>
            </div>
          ))}
          {media.length === 0 ? (
            <p className="text-sm text-neutral-400">
              파일을 추가하거나 URL을 직접 붙여넣으세요.
            </p>
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
