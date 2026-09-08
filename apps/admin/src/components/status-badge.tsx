import type { InquiryStatus } from '@studio115/shared';
import { cn } from '@/lib/utils';

const MAP: Record<InquiryStatus, { ko: string; cls: string }> = {
  NEW: { ko: '신규', cls: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { ko: '진행중', cls: 'bg-amber-100 text-amber-700' },
  CONTACTED: { ko: '연락완료', cls: 'bg-violet-100 text-violet-700' },
  CLOSED: { ko: '종료', cls: 'bg-neutral-200 text-neutral-600' },
  SPAM: { ko: '스팸', cls: 'bg-red-100 text-red-600' },
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  const m = MAP[status] ?? MAP.NEW;
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
        m.cls,
      )}
    >
      {m.ko}
    </span>
  );
}
