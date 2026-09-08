'use client';

import Link from 'next/link';
import { EDITABLE_PAGE_SLUGS } from '@studio115/shared';
import { PageHeader } from '@/components/ui';

const LABEL: Record<string, string> = {
  about: 'ABOUT (회사소개)',
  terms: '이용약관',
  privacy: '개인정보처리방침',
};

export default function PagesListPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="페이지" />
      <p className="mb-4 text-xs text-neutral-500">
        본문에 이미지·영상을 자유롭게 넣을 수 있습니다. 국문/영문을 각각 작성합니다.
      </p>
      <ul className="divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {EDITABLE_PAGE_SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={`/pages/${slug}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
            >
              <span className="font-medium">{LABEL[slug] ?? slug}</span>
              <span className="font-mono text-xs text-neutral-400">/{slug} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
