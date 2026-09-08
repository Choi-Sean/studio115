'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CONTRACT_STATUSES, PROJECT_SCOPES } from '@studio115/shared';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'uploading' | 'sending' | 'ok' | 'error';

const fieldCls =
  'w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-ink-muted/70 focus:border-ink';
const labelCls = 'block font-mono text-[0.7rem] uppercase tracking-label text-ink-muted';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (String(fd.get('website') ?? '').length > 0) return; // honeypot
    if (fd.get('consent') !== 'on') {
      setStatus('error');
      return;
    }

    setStatus(files.length ? 'uploading' : 'sending');
    try {
      let attachments: string[] = [];
      if (files.length) {
        const up = new FormData();
        files.forEach((f) => up.append('files', f));
        const ur = await fetch('/api/contact/attachments', {
          method: 'POST',
          body: up,
        });
        if (!ur.ok) throw new Error('upload failed');
        attachments = ((await ur.json()) as { urls?: string[] }).urls ?? [];
      }

      setStatus('sending');
      const payload = {
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email') || undefined,
        industry: fd.get('industry'),
        businessName: fd.get('businessName') || undefined,
        region: fd.get('region'),
        addressDetail: fd.get('addressDetail') || undefined,
        scopes: fd.getAll('scopes'),
        contractStatus: fd.get('contractStatus') || undefined,
        message: fd.get('message'),
        budgetText: fd.get('budgetText') || undefined,
        attachments,
        privacyConsent: true,
        website: '',
      };
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('ok');
      form.reset();
      setFiles([]);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="border border-line p-6">
        <p className="font-medium">{t('successTitle')}</p>
        <p className="mt-2 text-sm text-ink-soft">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-10 gap-y-7 md:grid-cols-2">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label className={labelCls} htmlFor="name">
          {t('name')} *
        </label>
        <input id="name" name="name" required maxLength={80} className={fieldCls} />
      </div>
      <div>
        <label className={labelCls} htmlFor="phone">
          {t('phone')} *
        </label>
        <input
          id="phone"
          name="phone"
          required
          maxLength={30}
          inputMode="tel"
          placeholder="010-0000-0000"
          className={fieldCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="email">
          {t('email')}
        </label>
        <input id="email" name="email" type="email" className={fieldCls} />
      </div>
      <div>
        <label className={labelCls} htmlFor="industry">
          {t('industry')} *
        </label>
        <input id="industry" name="industry" required maxLength={80} className={fieldCls} />
      </div>

      <div>
        <label className={labelCls} htmlFor="businessName">
          {t('businessName')}
        </label>
        <input
          id="businessName"
          name="businessName"
          maxLength={120}
          placeholder={t('businessNameHint')}
          className={fieldCls}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor="budgetText">
          {t('budget')}
        </label>
        <input
          id="budgetText"
          name="budgetText"
          maxLength={200}
          placeholder={t('budgetHint')}
          className={fieldCls}
        />
      </div>

      <div className="md:col-span-2 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="region">
            {t('region')} *
          </label>
          <input
            id="region"
            name="region"
            required
            maxLength={200}
            placeholder={t('regionPlaceholder')}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="addressDetail">
            {t('addressDetail')}
          </label>
          <input
            id="addressDetail"
            name="addressDetail"
            maxLength={200}
            className={fieldCls}
          />
        </div>
      </div>

      <fieldset className="md:col-span-2">
        <legend className={labelCls}>{t('scope')}</legend>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {PROJECT_SCOPES.map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input type="checkbox" name="scopes" value={s} />
              {t(`scopeOptions.${s}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="md:col-span-2">
        <legend className={labelCls}>{t('contract')}</legend>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {CONTRACT_STATUSES.map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input type="radio" name="contractStatus" value={s} />
              {t(`contractOptions.${s}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="md:col-span-2">
        <label className={labelCls}>{t('files')}</label>
        <p className="mt-1 text-xs text-ink-muted">{t('filesHint')}</p>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-line px-4 py-2 text-sm hover:border-ink">
          {t('filesButton')}
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files).slice(0, 10) : [])
            }
          />
        </label>
        {files.length > 0 ? (
          <ul className="mt-2 space-y-1 text-xs text-ink-soft">
            {files.map((f, i) => (
              <li key={i}>— {f.name}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label className={labelCls} htmlFor="message">
          {t('description')} *
        </label>
        <p className="mt-1 text-xs text-ink-muted">{t('descriptionHint')}</p>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={5}
          maxLength={5000}
          className={cn(fieldCls, 'mt-2 resize-y border border-line px-3 py-2 focus:border-ink')}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelCls}>{t('consent')} *</label>
        <div className="mt-2 h-32 overflow-y-auto border border-line p-3 text-xs leading-relaxed text-ink-soft">
          {t('consentText')}
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" name="consent" required />
          {t('consentAgree')}
        </label>
      </div>

      <div className="md:col-span-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending' || status === 'uploading'}
          className="border border-ink bg-ink px-8 py-2.5 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {status === 'uploading'
            ? t('uploading')
            : status === 'sending'
              ? t('sending')
              : t('submit')}
        </button>
        <p className="text-xs text-ink-muted">{t('requiredHint')}</p>
      </div>

      {status === 'error' ? (
        <p className="md:col-span-2 text-sm text-ink">{t('errorBody')}</p>
      ) : null}
    </form>
  );
}
