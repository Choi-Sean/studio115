'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  INQUIRY_STATUSES,
  type InquiryDto,
  type Paginated,
} from '@studio115/shared';
import { useApi } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';
import { PageHeader, Select } from '@/components/ui';
import { formatDateTime } from '@/lib/format';

const STATUS_KO: Record<string, string> = {
  NEW: '신규',
  IN_PROGRESS: '진행중',
  CONTACTED: '연락완료',
  CLOSED: '종료',
  SPAM: '스팸',
};

export default function InquiriesPage() {
  const [status, setStatus] = useState('');
  const query = new URLSearchParams({ pageSize: '100' });
  if (status) query.set('status', status);
  const { data, isLoading } = useApi<Paginated<InquiryDto>>(
    `/admin/inquiries?${query.toString()}`,
  );

  return (
    <div>
      <PageHeader title="문의">
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-36"
        >
          <option value="">전체 상태</option>
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_KO[s] ?? s}
            </option>
          ))}
        </Select>
      </PageHeader>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">상태</th>
              <th className="px-4 py-2.5 font-medium">이름</th>
              <th className="px-4 py-2.5 font-medium">연락처</th>
              <th className="px-4 py-2.5 font-medium">유형</th>
              <th className="px-4 py-2.5 font-medium">접수일</th>
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
              data.items.map((q) => (
                <tr key={q.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/inquiries/${q.id}`}
                      className="font-medium hover:underline"
                    >
                      {q.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{q.phone}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {q.projectType ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {formatDateTime(q.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
