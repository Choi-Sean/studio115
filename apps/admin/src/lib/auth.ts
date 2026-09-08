'use client';

import type { AuthUserDto } from '@studio115/shared';

const TOKEN_KEY = 's115_admin_token';
const USER_KEY = 's115_admin_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUserDto | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUserDto): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
