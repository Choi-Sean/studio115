'use client';

import { useEffect, useState } from 'react';
import { ApiError, apiFetch, useApi } from '@/lib/api';
import { Button, Input, PageHeader } from '@/components/ui';

export default function SettingsPage() {
  const { data, isLoading, mutate } = useApi<Record<string, string>>(
    '/admin/settings',
  );
  const [rows, setRows] = useState<Array<[string, string]>>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setRows(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)));
    }
  }, [data]);

  function update(i: number, value: string) {
    setRows((prev) => prev.map((r, j) => (j === i ? [r[0], value] : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, ['', '']]);
  }

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          items: rows
            .filter(([k]) => k.trim())
            .map(([key, value]) => ({ key: key.trim(), value })),
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

  return (
    <div className="max-w-3xl">
      <PageHeader title="사이트 설정">
        <Button variant="ghost" onClick={addRow}>
          항목 추가
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy ? '저장 중…' : '저장'}
        </Button>
      </PageHeader>

      <p className="mb-4 text-xs text-neutral-500">
        공개 사이트가 사용하는 key/value입니다. 예: <code>company.name</code>,{' '}
        <code>contact.phone</code>, <code>stats.projects</code>,{' '}
        <code>company.tagline.ko</code>
      </p>

      {isLoading ? (
        <p className="text-sm text-neutral-400">불러오는 중…</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={r[0]}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((x, j) => (j === i ? [e.target.value, x[1]] : x)),
                  )
                }
                placeholder="key"
                className="max-w-xs font-mono text-xs"
              />
              <Input
                value={r[1]}
                onChange={(e) => update(i, e.target.value)}
                placeholder="value"
              />
            </div>
          ))}
        </div>
      )}

      {saved ? (
        <p className="mt-4 text-sm text-green-600">저장되었습니다.</p>
      ) : null}
    </div>
  );
}
