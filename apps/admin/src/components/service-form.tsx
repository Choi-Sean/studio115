'use client';

import { useState } from 'react';
import type { ServiceDto } from '@studio115/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { Button, Field, Input, Textarea } from './ui';

export function ServiceForm({
  initial,
  onDone,
  onCancel,
}: {
  initial?: ServiceDto;
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
      slug: slug || slugify(s('titleEn')),
      titleKo: s('titleKo'),
      titleEn: s('titleEn'),
      descriptionKo: s('descriptionKo'),
      descriptionEn: s('descriptionEn'),
      icon: s('icon') || undefined,
      order: fd.get('order') ? Number(fd.get('order')) : 0,
      published: fd.get('published') === 'on',
    };
    setBusy(true);
    setError('');
    try {
      if (editing) {
        await apiFetch(`/admin/services/${initial!.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/admin/services', {
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
        <Field label="제목 (KO)">
          <Input name="titleKo" required defaultValue={initial?.title.ko} />
        </Field>
        <Field label="Title (EN)">
          <Input name="titleEn" required defaultValue={initial?.title.en} />
        </Field>
        <Field label="슬러그">
          <Input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            required
          />
        </Field>
        <Field label="아이콘" hint="home / store / briefcase / ruler / sofa">
          <Input name="icon" defaultValue={initial?.icon ?? ''} />
        </Field>
        <Field label="설명 (KO)">
          <Textarea name="descriptionKo" required defaultValue={initial?.description.ko} />
        </Field>
        <Field label="Description (EN)">
          <Textarea name="descriptionEn" required defaultValue={initial?.description.en} />
        </Field>
        <Field label="정렬">
          <Input name="order" type="number" defaultValue={initial?.order ?? 0} />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} />
          공개
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
