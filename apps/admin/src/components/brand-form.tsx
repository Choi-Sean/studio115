'use client';

import { useState } from 'react';
import type { BrandDto } from '@studio115/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { Button, Field, Input, Textarea } from './ui';

export function BrandForm({
  initial,
  onDone,
  onCancel,
}: {
  initial?: BrandDto;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const editing = Boolean(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [slug, setSlug] = useState(initial?.slug ?? '');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const body = {
      slug: slugify(slug || s('nameEn')),
      tagKo: s('tagKo'),
      tagEn: s('tagEn'),
      nameKo: s('nameKo'),
      nameEn: s('nameEn'),
      descriptionKo: s('descriptionKo'),
      descriptionEn: s('descriptionEn'),
      live: fd.get('live') === 'on',
      published: fd.get('published') === 'on',
      order: fd.get('order') ? Number(fd.get('order')) : 0,
    };
    setBusy(true);
    setError('');
    try {
      if (editing) {
        await apiFetch(`/admin/brands/${initial!.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/admin/brands', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '저장 실패');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이름 (KO)" required>
          <Input name="nameKo" required defaultValue={initial?.name.ko} />
        </Field>
        <Field label="Name (EN)" required>
          <Input
            name="nameEn"
            required
            defaultValue={initial?.name.en}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
        </Field>
        <Field label="분류 라벨 (KO)" hint="예: 인테리어" required>
          <Input name="tagKo" required defaultValue={initial?.tag.ko} />
        </Field>
        <Field label="Category label (EN)" hint="e.g. Interior" required>
          <Input name="tagEn" required defaultValue={initial?.tag.en} />
        </Field>
        <Field label="슬러그" hint="영문명에서 자동 생성 · 수정 불가">
          <Input
            name="slug"
            value={slug}
            readOnly
            tabIndex={-1}
            className="bg-neutral-100 text-neutral-500"
          />
        </Field>
        <Field label="정렬">
          <Input name="order" type="number" defaultValue={initial?.order ?? 0} />
        </Field>
        <Field label="설명 (KO)" required>
          <Textarea name="descriptionKo" required defaultValue={initial?.description.ko} />
        </Field>
        <Field label="Description (EN)" required>
          <Textarea name="descriptionEn" required defaultValue={initial?.description.en} />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} />
          공개
        </label>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input type="checkbox" name="live" defaultChecked={initial?.live ?? false} />
          런칭됨 (체크 해제 시 "Coming soon" 표시)
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? '저장 중…' : editing ? '저장' : '추가'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            취소
          </Button>
        ) : null}
      </div>
    </form>
  );
}
