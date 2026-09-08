import { ProjectForm } from '@/components/project-form';
import { PageHeader } from '@/components/ui';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader title="새 프로젝트" />
      <ProjectForm />
    </div>
  );
}
