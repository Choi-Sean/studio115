'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BUDGET_RANGES } from '@studio115/shared';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'ok' | 'error';

const field =
  'w-full border-b border-line bg-transparent py-2.5 text-sm outline-none transition-colors placeholder:text-ink-muted/70 focus:border-ink';
const label = 'block text-xs uppercase tracking-[0.16em] text-ink-muted';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="border border-line bg-white/40 p-6">
        <p className="font-display text-lg">{t('successTitle')}</p>
        <p className="mt-2 text-sm text-ink-soft">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            {t('name')} *
          </label>
          <input id="name" name="name" required maxLength={80} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            {t('phone')} *
          </label>
          <input id="phone" name="phone" required maxLength={30} className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="email">
          {t('email')}
        </label>
        <input id="email" name="email" type="email" className={field} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="projectType">
            {t('projectType')}
          </label>
          <input
            id="projectType"
            name="projectType"
            maxLength={80}
            placeholder={t('projectTypePlaceholder')}
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="budgetRange">
            {t('budget')}
          </label>
          <select id="budgetRange" name="budgetRange" defaultValue="" className={cn(field, 'appearance-none')}>
            <option value="">{t('budgetOptions.none')}</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {t(`budgetOptions.${b}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="preferredContact">
          {t('preferredContact')}
        </label>
        <input
          id="preferredContact"
          name="preferredContact"
          maxLength={40}
          placeholder={t('preferredContactPlaceholder')}
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="message">
          {t('message')} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={5}
          maxLength={4000}
          placeholder={t('messagePlaceholder')}
          className={cn(field, 'resize-y')}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        <p className="text-xs text-ink-muted">{t('requiredHint')}</p>
      </div>

      {status === 'error' ? (
        <p className="text-sm text-accent">{t('errorBody')}</p>
      ) : null}
    </form>
  );
}
