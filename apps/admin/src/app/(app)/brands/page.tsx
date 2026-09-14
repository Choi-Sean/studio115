'use client';

import { useState } from 'react';
import type { BrandDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { BrandForm } from '@/components/brand-form';
import { Button, PageHeader } from '@/components/ui';

export default function BrandsPage() {
  const { data, isLoading, mutate } = useApi<BrandDto[]>('/admin/brands');
  const [editing, setEditing] = useState<BrandDto | null>(null);
  const [creating, setCreating] = useState(false);

  function done() {
    setEditing(null);
    setCreating(false);
    mutate();
  }

  async function remove(b: BrandDto) {
    if (!confirm(`"${b.name.ko}" 브랜드를 삭제할까요?`)) return;
    try {
      await apiFetch(`/admin/brands/${b.id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '삭제 실패');
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="STIIO 브랜드">
        {!creating && !editing ? (
          <Button onClick={() => setCreating(true)}>브랜드 추가</Button>
        ) : null}
      </PageHeader>

      <p className="mb-4 text-xs text-neutral-500">
        STIIO 페이지의 서브 브랜드 카드입니다. "런칭됨"을 해제하면 카드에 "Coming
        soon"이 표시됩니다.
      </p>

      {creating ? (
        <div className="mb-4">
          <BrandForm onDone={done} onCancel={() => setCreating(false)} />
        </div>
      ) : null}

      <ul className="space-y-2">
        {isLoading ? (
          <li className="text-sm text-neutral-400">불러오는 중…</li>
        ) : (
          data?.map((b) =>
            editing?.id === b.id ? (
              <li key={b.id}>
                <BrandForm
                  initial={b}
                  onDone={done}
                  onCancel={() => setEditing(null)}
                />
              </li>
            ) : (
              <li
                key={b.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{b.name.ko}</span>
                  <span className="ml-2 text-neutral-400">{b.name.en}</span>
                  <span className="ml-2 font-mono text-xs text-neutral-400">
                    /{b.slug}
                  </span>
                  {!b.live ? (
                    <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                      Coming soon
                    </span>
                  ) : null}
                  {!b.published ? (
                    <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                      비공개
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setEditing(b)}>
                    편집
                  </Button>
                  <Button variant="danger" onClick={() => remove(b)}>
                    삭제
                  </Button>
                </span>
              </li>
            ),
          )
        )}
      </ul>
    </div>
  );
}
