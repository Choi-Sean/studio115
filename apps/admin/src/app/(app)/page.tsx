'use client';

import Link from 'next/link';
import type {
  InquiryDto,
  Paginated,
  ProjectDto,
  ServiceDto,
} from '@studio115/shared';
import { useApi } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';
import { formatDateTime } from '@/lib/format';

export default function DashboardPage() {
  const stats = useApi<{ total: number; byStatus: Record<string, number> }>(
    '/admin/inquiries/stats',
  );
  const recent = useApi<Paginated<InquiryDto>>('/admin/inquiries?pageSize=6');
  const projects = useApi<Paginated<ProjectDto>>('/admin/projects?pageSize=1');
  const services = useApi<ServiceDto[]>('/admin/services');

  const cards = [
    { label: '전체 문의', value: stats.data?.total },
    { label: '신규 문의', value: stats.data?.byStatus?.NEW ?? 0 },
    { label: '프로젝트', value: projects.data?.total },
    { label: '서비스', value: services.data?.length },
  ];

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold">대시보드</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <p className="text-xs text-neutral-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">
              {c.value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <p className="text-sm font-medium">최근 문의</p>
          <Link href="/inquiries" className="text-xs text-neutral-500 hover:text-neutral-900">
            전체 보기 →
          </Link>
        </div>
        <ul className="divide-y divide-neutral-100">
          {recent.isLoading ? (
            <li className="px-4 py-6 text-sm text-neutral-400">불러오는 중…</li>
          ) : recent.data && recent.data.items.length > 0 ? (
            recent.data.items.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/inquiries/${q.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-3">
                    <StatusBadge status={q.status} />
                    <span className="font-medium">{q.name}</span>
                    <span className="hidden text-neutral-400 sm:inline">
                      {q.projectType ?? '—'}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDateTime(q.createdAt)}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-sm text-neutral-400">문의가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
