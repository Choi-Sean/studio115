'use client';

import { useState } from 'react';
import type { CategoryDto } from '@studio115/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { Button, Field, Input } from './ui';

export function CategoryForm({
  initial,
  onDone,
  onCancel,
}: {
  initial?: CategoryDto;
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
    const body = {
      slug: slug || slugify(String(fd.get('nameEn') ?? '')),
      nameKo: String(fd.get('nameKo') ?? '').trim(),
      nameEn: String(fd.get('nameEn') ?? '').trim(),
      order: fd.get('order') ? Number(fd.get('order')) : 0,
    };
    setBusy(true);
    setError('');
    try {
      if (editing) {
        await apiFetch(`/admin/categories/${initial!.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/admin/categories', {
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
      className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-4"
    >
      <Field label="이름 (KO)">
        <Input name="nameKo" required defaultValue={initial?.name.ko} />
      </Field>
      <Field label="Name (EN)">
        <Input name="nameEn" required defaultValue={initial?.name.en} />
      </Field>
      <Field label="슬러그" hint="URL">
        <Input
          name="slug"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
        />
      </Field>
      <Field label="정렬">
        <Input name="order" type="number" defaultValue={initial?.order ?? 0} />
      </Field>

      {error ? (
        <p className="sm:col-span-4 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="sm:col-span-4 flex gap-2">
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
