import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import type { ProjectDto } from '@studio115/shared';
import { Link } from '@/i18n/navigation';
import { pick } from '@/lib/format';

export async function WorkCard({
  project,
  priority = false,
}: {
  project: ProjectDto;
  priority?: boolean;
}) {
  const locale = await getLocale();

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={pick(project.title, locale)}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : null}
      </div>
      <p className="mt-2.5 font-mono text-xs uppercase tracking-label text-ink">
        {project.title.en}
      </p>
      <p className="mt-0.5 text-[0.72rem] text-ink-muted">
        {[project.type, project.location].filter(Boolean).join(' · ')}
      </p>
    </Link>
  );
}
