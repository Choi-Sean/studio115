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

const SCOPE_KO: Record<string, string> = {
  CONSTRUCTION: '공간 시공',
  DESIGN: '공간 디자인',
  BRANDING: '브랜딩 디자인',
};

const CONTRACT_KO: Record<string, string> = {
  SIGNED: '계약 완료',
  IN_PROGRESS: '계약 중',
  NONE: '미계약',
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

  const inquiry = data;

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
    ['이름', inquiry.name],
    ['연락처', inquiry.phone],
    ['이메일', inquiry.email],
    ['업종', inquiry.industry],
    ['상호', inquiry.businessName],
    [
      '프로젝트 지역',
      [inquiry.region, inquiry.addressDetail].filter(Boolean).join(' ') || null,
    ],
    [
      '프로젝트 유형',
      inquiry.scopes.length
        ? inquiry.scopes.map((s) => SCOPE_KO[s] ?? s).join(', ')
        : null,
    ],
    [
      '부동산 계약',
      inquiry.contractStatus
        ? CONTRACT_KO[inquiry.contractStatus] ?? inquiry.contractStatus
        : null,
    ],
    ['예산', inquiry.budgetText],
    ['접수일', formatDateTime(inquiry.createdAt)],
  ];

  return (
    <div className="max-w-2xl">
      <PageHeader title={`문의 · ${inquiry.name}`}>
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
        <p className="mb-1 text-xs font-medium text-neutral-600">프로젝트 설명</p>
        <p className="whitespace-pre-wrap text-sm text-neutral-800">
          {inquiry.message}
        </p>
      </div>

      {inquiry.attachments.length > 0 ? (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
          <p className="mb-2 text-xs font-medium text-neutral-600">첨부 파일</p>
          <ul className="space-y-1 text-sm">
            {inquiry.attachments.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  첨부 {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <Field label="상태">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as InquiryStatus)}
            className="max-w-xs"
          >
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_KO[s] ?? s}
              </option>
            ))}
          </Select>
        </Field>
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
