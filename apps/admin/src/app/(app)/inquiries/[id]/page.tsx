'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  INQUIRY_STATUSES,
  type InquiryDto,
  type InquiryStatus,
} from '@studio115/shared';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { Button, Field, PageHeader, Select, Textarea } from '@/components/ui';
import { formatDateTime } from '@/lib/format';

const STATUS_KO: Record<string, string> = {
  NEW: '신규',
  IN_PROGRESS: '진행중',
  CONTACTED: '연락완료',
  CLOSED: '종료',
  SPAM: '스팸',
};

const BUDGET_KO: Record<string, string> = {
  UNDER_20M: '2천만원 미만',
  FROM_20M_TO_50M: '2천만 ~ 5천만원',
  FROM_50M_TO_100M: '5천만 ~ 1억원',
  OVER_100M: '1억원 이상',
  UNDECIDED: '미정',
};

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error, mutate } = useApi<InquiryDto>(
    `/admin/inquiries/${id}`,
  );

  const [status, setStatus] = useState<InquiryStatus>('NEW');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setNote(data.adminNote ?? '');
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-neutral-400">불러오는 중…</p>;
  if (error || !data)
    return <p className="text-sm text-red-600">문의를 찾을 수 없습니다.</p>;

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await apiFetch(`/admin/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNote: note }),
      });
      await mutate();
      setSaved(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '저장 실패');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm('이 문의를 삭제할까요?')) return;
    try {
      await apiFetch(`/admin/inquiries/${id}`, { method: 'DELETE' });
      router.push('/inquiries');
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '삭제 실패');
    }
  }

  const rows: Array<[string, string | null]> = [
    ['이름', data.name],
    ['연락처', data.phone],
    ['이메일', data.email],
    ['공간 유형', data.projectType],
    ['예산', data.budgetRange ? BUDGET_KO[data.budgetRange] ?? data.budgetRange : null],
    ['선호 연락', data.preferredContact],
    ['접수일', formatDateTime(data.createdAt)],
  ];

  return (
    <div className="max-w-2xl">
      <PageHeader title={`문의 · ${data.name}`}>
        <Button variant="danger" onClick={remove}>
          삭제
        </Button>
      </PageHeader>

      <dl className="rounded-lg border border-neutral-200 bg-white text-sm">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex gap-4 border-b border-neutral-100 px-4 py-2.5 last:border-0"
          >
            <dt className="w-24 shrink-0 text-neutral-500">{k}</dt>
            <dd>{v ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="mb-1 text-xs font-medium text-neutral-600">문의 내용</p>
        <p className="whitespace-pre-wrap text-sm text-neutral-800">
          {data.message}
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="상태">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as InquiryStatus)}
            >
              {INQUIRY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_KO[s] ?? s}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="내부 메모">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-28"
          />
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
