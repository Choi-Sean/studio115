'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PageDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { RichEditor } from '@/components/rich-editor';
import { Button, Field, Input, PageHeader } from '@/components/ui';

export default function PageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data, isLoading, mutate } = useApi<PageDto>(`/admin/pages/${slug}`);

  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [bodyKo, setBodyKo] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setTitleKo(data.title.ko);
      setTitleEn(data.title.en);
      setBodyKo(data.body.ko);
      setBodyEn(data.body.en);
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-neutral-400">불러오는 중…</p>;

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await apiFetch(`/admin/pages/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ titleKo, titleEn, bodyKo, bodyEn }),
      });
      await mutate();
      setSaved(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '저장 실패');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={`페이지 · /${slug}`}>
        <Button variant="ghost" onClick={() => router.push('/pages')}>
          목록
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy ? '저장 중…' : '저장'}
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="제목 (KO)" required>
            <Input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} />
          </Field>
          <Field label="Title (EN)" required>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </Field>
        </div>

        <Field label="본문 (KO)" required>
          <RichEditor value={bodyKo} onChange={setBodyKo} prefix="pages" minHeight="14rem" />
        </Field>
        <Field label="Body (EN)" required>
          <RichEditor value={bodyEn} onChange={setBodyEn} prefix="pages" minHeight="14rem" />
        </Field>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={busy}>
            {busy ? '저장 중…' : '저장'}
          </Button>
          {saved ? (
            <span className="text-sm text-green-600">저장되었습니다.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
