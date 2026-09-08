'use client';

import { useState } from 'react';
import type { ServiceDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { ServiceForm } from '@/components/service-form';
import { Button, PageHeader } from '@/components/ui';

export default function ServicesPage() {
  const { data, isLoading, mutate } = useApi<ServiceDto[]>('/admin/services');
  const [editing, setEditing] = useState<ServiceDto | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string, title: string) {
    if (!confirm(`"${title}" 서비스를 삭제할까요?`)) return;
    try {
      await apiFetch(`/admin/services/${id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '삭제 실패');
    }
  }

  function done() {
    setEditing(null);
    setCreating(false);
    mutate();
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="서비스">
        {!creating && !editing ? (
          <Button onClick={() => setCreating(true)}>서비스 추가</Button>
        ) : null}
      </PageHeader>

      {creating ? (
        <div className="mb-6">
          <ServiceForm onDone={done} onCancel={() => setCreating(false)} />
        </div>
      ) : null}

      <ul className="space-y-3">
        {isLoading ? (
          <li className="text-sm text-neutral-400">불러오는 중…</li>
        ) : (
          data?.map((s) =>
            editing?.id === s.id ? (
              <li key={s.id}>
                <ServiceForm
                  initial={s}
                  onDone={done}
                  onCancel={() => setEditing(null)}
                />
              </li>
            ) : (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {s.title.ko}
                    <span className="ml-2 text-xs text-neutral-400">
                      {s.title.en}
                    </span>
                    {!s.published ? (
                      <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-500">
                        비공개
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {s.description.ko}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setEditing(s)}>
                    편집
                  </Button>
                  <Button variant="danger" onClick={() => remove(s.id, s.title.ko)}>
                    삭제
                  </Button>
                </div>
              </li>
            ),
          )
        )}
      </ul>
    </div>
  );
}
