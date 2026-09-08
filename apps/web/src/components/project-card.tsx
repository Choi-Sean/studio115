import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ProjectDto } from '@studio115/shared';
import { Link } from '@/i18n/navigation';
import { pick } from '@/lib/format';

export async function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectDto;
  priority?: boolean;
}) {
  const locale = await getLocale();
  const t = await getTranslations('projects.category');

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={pick(project.title, locale)}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-snug">
          {pick(project.title, locale)}
        </h3>
        <span className="shrink-0 text-xs text-ink-muted">{project.year}</span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {t(project.category)}
        {project.location ? ` · ${project.location}` : ''}
      </p>
    </Link>
  );
}
