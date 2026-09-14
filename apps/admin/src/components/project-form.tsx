'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CategoryDto, ProjectDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { uploadMedia } from '@/lib/upload';
import { slugify } from '@/lib/utils';
import { RichEditor } from './rich-editor';
import { ProjectPreview } from './project-preview';
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

  // Mirrors the read-only inputs below just so the preview pane can render
  // live — the actual submit still reads straight off the DOM via FormData.
  const [titleKo, setTitleKo] = useState(initial?.title.ko ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title.en ?? '');
  const [type, setType] = useState(initial?.type ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [sizeLabel, setSizeLabel] = useState(initial?.sizeLabel ?? '');
  const [involvement, setInvolvement] = useState(initial?.involvement ?? '');
  const [completionDate, setCompletionDate] = useState(initial?.completionDate ?? '');
  const [photography, setPhotography] = useState(initial?.photography ?? '');

  const catOptions = useMemo(
    () => categories ?? (initial ? [{ ...initial.category, order: 0 }] : []),
    [categories, initial],
  );
  const selectedCategory = catOptions.find((c) => c.id === categoryId);

  function patchMedia(i: number, patch: Partial<MediaRow>) {
    setMedia((prev) => prev.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  }

  function moveMedia(i: number, dir: -1 | 1) {
    setMedia((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
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
      slug: slugify(slug || s('titleEn')),
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
    <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="제목 (KO)" required>
            <Input
              name="titleKo"
              required
              value={titleKo}
              onChange={(e) => setTitleKo(e.target.value)}
            />
          </Field>
          <Field label="Title (EN)" required>
            <Input
              name="titleEn"
              required
              value={titleEn}
              onChange={(e) => {
                setTitleEn(e.target.value);
                setSlug(slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="슬러그" hint="영문 제목에서 자동 생성 · 수정 불가">
            <Input
              name="slug"
              value={slug}
              readOnly
              tabIndex={-1}
              className="bg-neutral-100 text-neutral-500"
            />
          </Field>
          <Field label="카테고리" required>
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
          <Field label="요약 (KO)" required>
            <Input name="summaryKo" required defaultValue={initial?.summary.ko} />
          </Field>
          <Field label="Summary (EN)" required>
            <Input name="summaryEn" required defaultValue={initial?.summary.en} />
          </Field>
        </div>

        <Field label="본문 (KO)" required>
          <RichEditor value={descKo} onChange={setDescKo} prefix="projects" />
        </Field>
        <Field label="Body (EN)" required>
          <RichEditor value={descEn} onChange={setDescEn} prefix="projects" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="TYPE" hint="예: Residence, Cafe">
            <Input value={type} onChange={(e) => setType(e.target.value)} name="type" />
          </Field>
          <Field label="LOCATION">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              name="location"
            />
          </Field>
          <Field label="SIZE" hint="예: 122 m²">
            <Input
              value={sizeLabel}
              onChange={(e) => setSizeLabel(e.target.value)}
              name="sizeLabel"
            />
          </Field>
          <Field label="INVOLVEMENT" hint="예: Design, Construction">
            <Input
              value={involvement}
              onChange={(e) => setInvolvement(e.target.value)}
              name="involvement"
            />
          </Field>
          <Field label="DATE OF COMPLETION" hint="예: 12.2023">
            <Input
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              name="completionDate"
            />
          </Field>
          <Field label="PHOTOGRAPHY">
            <Input
              value={photography}
              onChange={(e) => setPhotography(e.target.value)}
              name="photography"
            />
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
            {media.map((m, i) => {
              const isCover = i === media.findIndex((x) => x.type === 'IMAGE');
              return (
                <div
                  key={i}
                  className="rounded-md border border-neutral-200 bg-white p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs text-neutral-400">
                      {i + 1}
                    </span>

                    {/* Reorder */}
                    <div className="flex shrink-0 flex-col">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => moveMedia(i, -1)}
                        aria-label="위로 이동"
                        className="text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={i === media.length - 1}
                        onClick={() => moveMedia(i, 1)}
                        aria-label="아래로 이동"
                        className="text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Live thumbnail — shows what will actually render on the site */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-neutral-100">
                      {m.url.trim() ? (
                        m.type === 'VIDEO' ? (
                          <video
                            src={m.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.url}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.visibility = 'hidden';
                            }}
                          />
                        )
                      ) : null}
                      {isCover ? (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[0.6rem] leading-none text-white">
                          커버
                        </span>
                      ) : null}
                    </div>

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
                  <div className="mt-2 flex gap-2 pl-[7rem]">
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
              );
            })}
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

      {/* Live preview — mirrors the real WORK detail page as you type */}
      <div className="xl:sticky xl:top-6">
        <p className="mb-2 text-sm font-medium text-neutral-700">미리보기</p>
        <ProjectPreview
          titleKo={titleKo}
          titleEn={titleEn}
          categoryKo={selectedCategory?.name.ko ?? ''}
          categoryEn={selectedCategory?.name.en ?? ''}
          descriptionHtml={descKo}
          type={type}
          location={location}
          sizeLabel={sizeLabel}
          involvement={involvement}
          completionDate={completionDate}
          photography={photography}
          media={media.filter((m) => m.url.trim())}
        />
      </div>
    </div>
  );
}
