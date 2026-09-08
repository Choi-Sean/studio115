'use client';

import Link from 'next/link';
import type { Paginated, ProjectDto } from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { Button, PageHeader } from '@/components/ui';

export default function ProjectsListPage() {
  const { data, isLoading, mutate } = useApi<Paginated<ProjectDto>>(
    '/admin/projects?pageSize=100',
  );

  async function remove(id: string, title: string) {
    if (!confirm(`"${title}" 프로젝트를 삭제할까요?`)) return;
    try {
      await apiFetch(`/admin/projects/${id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '삭제 실패');
    }
  }

  return (
    <div>
      <PageHeader title="프로젝트">
        <Link
          href="/projects/new"
          className="rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          새 프로젝트
        </Link>
      </PageHeader>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">제목</th>
              <th className="px-4 py-2.5 font-medium">카테고리</th>
              <th className="px-4 py-2.5 font-medium">연도</th>
              <th className="px-4 py-2.5 font-medium">상태</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  불러오는 중…
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.title.ko}
                    </Link>
                    <span className="ml-2 text-xs text-neutral-400">/{p.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.category}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.year ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="flex gap-1.5 text-xs">
                      <span
                        className={
                          p.published
                            ? 'rounded bg-green-100 px-1.5 py-0.5 text-green-700'
                            : 'rounded bg-neutral-200 px-1.5 py-0.5 text-neutral-500'
                        }
                      >
                        {p.published ? '공개' : '비공개'}
                      </span>
                      {p.featured ? (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
                          대표
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      onClick={() => remove(p.id, p.title.ko)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  프로젝트가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
