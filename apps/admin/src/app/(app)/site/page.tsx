'use client';

import { useEffect, useState } from 'react';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { Button, Field, Input, PageHeader } from '@/components/ui';

type FieldDef = {
  key: string;
  label: string;
  hint?: string;
  textarea?: boolean;
  required?: boolean;
};

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  {
    title: '회사',
    fields: [
      { key: 'company.nameKo', label: '회사명 (KO)', required: true },
      { key: 'company.name', label: 'Company name (EN)', required: true },
      { key: 'company.tagline.ko', label: '태그라인 (KO)' },
      { key: 'company.tagline.en', label: 'Tagline (EN)' },
    ],
  },
  {
    title: '연락처 (사이트 표시용)',
    fields: [
      { key: 'contact.email', label: '이메일', required: true },
      { key: 'contact.phone', label: '전화번호', hint: '비우면 플로팅 전화 버튼 숨김' },
      { key: 'contact.address.ko', label: '주소 (KO)' },
      { key: 'contact.address.en', label: 'Address (EN)' },
      { key: 'contact.hours', label: '운영 시간' },
      { key: 'social.instagram', label: '인스타그램 URL' },
    ],
  },
  {
    title: '푸터 · 사업자 정보 (전자상거래법 필수 표기)',
    fields: [
      { key: 'legal.bizName', label: '상호명', required: true },
      { key: 'legal.owner', label: '대표자', required: true },
      { key: 'legal.address', label: '사업장 주소', required: true },
      { key: 'legal.phone', label: '연락처', required: true },
      { key: 'legal.email', label: '이메일', required: true },
      { key: 'legal.bizNumber', label: '사업자등록번호', required: true },
      { key: 'legal.mailOrderNumber', label: '통신판매업 신고번호', required: true },
      { key: 'legal.hosting', label: '호스팅 제공자', required: true },
      { key: 'footer.notice', label: '하단 안내문', hint: '자유 문구 (비우면 숨김)' },
    ],
  },
];

const ALL_KEYS = GROUPS.flatMap((g) => g.fields.map((f) => f.key));

export default function SiteInfoPage() {
  const { data, isLoading, mutate } = useApi<Record<string, string>>(
    '/admin/settings',
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setValues(Object.fromEntries(ALL_KEYS.map((k) => [k, data[k] ?? ''])));
    }
  }, [data]);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          items: ALL_KEYS.map((key) => ({ key, value: values[key] ?? '' })),
        }),
      });
      await mutate();
      setSaved(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : '저장 실패');
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) return <p className="text-sm text-neutral-400">불러오는 중…</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader title="사이트 정보">
        <Button onClick={save} disabled={busy}>
          {busy ? '저장 중…' : '저장'}
        </Button>
      </PageHeader>

      <div className="space-y-8">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700">
              {g.title}
            </h2>
            <div className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2">
              {g.fields.map((f) => (
                <Field key={f.key} label={f.label} hint={f.hint} required={f.required}>
                  <Input
                    value={values[f.key] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    }
                  />
                </Field>
              ))}
            </div>
          </section>
        ))}

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
