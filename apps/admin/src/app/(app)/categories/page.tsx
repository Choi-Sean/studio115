'use client';

import { useState } from 'react';
import type { CategoryDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { CategoryForm } from '@/components/category-form';
import { Button, PageHeader } from '@/components/ui';

export default function CategoriesPage() {
  const { data, isLoading, mutate } = useApi<CategoryDto[]>('/admin/categories');
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [creating, setCreating] = useState(false);

  function done() {
    setEditing(null);
    setCreating(false);
    mutate();
  }

  async function remove(c: CategoryDto) {
    if (!confirm(`"${c.name.ko}" 카테고리를 삭제할까요?`)) return;
    try {
      await apiFetch(`/admin/categories/${c.id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '삭제 실패');
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="카테고리">
        {!creating && !editing ? (
          <Button onClick={() => setCreating(true)}>카테고리 추가</Button>
        ) : null}
      </PageHeader>

      <p className="mb-4 text-xs text-neutral-500">
        WORK 페이지의 필터로 쓰입니다. 프로젝트가 연결된 카테고리는 삭제 전에 옮겨야
        합니다.
      </p>

      {creating ? (
        <div className="mb-4">
          <CategoryForm onDone={done} onCancel={() => setCreating(false)} />
        </div>
      ) : null}

      <ul className="space-y-2">
        {isLoading ? (
          <li className="text-sm text-neutral-400">불러오는 중…</li>
        ) : (
          data?.map((c) =>
            editing?.id === c.id ? (
              <li key={c.id}>
                <CategoryForm
                  initial={c}
                  onDone={done}
                  onCancel={() => setEditing(null)}
                />
              </li>
            ) : (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{c.name.ko}</span>
                  <span className="ml-2 text-neutral-400">{c.name.en}</span>
                  <span className="ml-2 font-mono text-xs text-neutral-400">
                    /{c.slug}
                  </span>
                  {typeof c.projectCount === 'number' ? (
                    <span className="ml-2 text-xs text-neutral-400">
                      · 프로젝트 {c.projectCount}
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setEditing(c)}>
                    편집
                  </Button>
                  <Button variant="danger" onClick={() => remove(c)}>
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
