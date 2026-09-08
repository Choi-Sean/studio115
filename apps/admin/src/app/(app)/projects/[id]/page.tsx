'use client';

import { use } from 'react';
import type { ProjectDto } from '@studio115/shared';
import { useApi } from '@/lib/api';
import { ProjectForm } from '@/components/project-form';
import { PageHeader } from '@/components/ui';

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useApi<ProjectDto>(`/admin/projects/${id}`);

  if (isLoading) {
    return <p className="text-sm text-neutral-400">불러오는 중…</p>;
  }
  if (error || !data) {
    return <p className="text-sm text-red-600">프로젝트를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title={`프로젝트 · ${data.title.ko}`} />
      <ProjectForm initial={data} />
    </div>
  );
}
