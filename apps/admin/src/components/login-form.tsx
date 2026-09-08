'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoginResponseDto } from '@studio115/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { setSession } from '@/lib/auth';
import { Button, Field, Input } from './ui';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const res = await apiFetch<LoginResponseDto>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: fd.get('email'),
          password: fd.get('password'),
        }),
      });
      setSession(res.accessToken, res.user);
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="아이디">
        <Input
          name="email"
          type="text"
          required
          autoComplete="username"
          defaultValue="admin"
        />
      </Field>
      <Field label="비밀번호">
        <Input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? '확인 중…' : '로그인'}
      </Button>
    </form>
  );
}
