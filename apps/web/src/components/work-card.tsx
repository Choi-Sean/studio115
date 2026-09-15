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
      {/* Most uploads are portrait (site photos shot vertically) — a 4:5 frame
          crops them gently; a wider landscape frame would slice off far more. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        {project.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImageUrl}
            alt={pick(project.title, locale)}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        {/* Title/meta stay hidden until hover, same as the STIIO OBJECTS gallery. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-paper/0 px-4 text-center opacity-0 transition-all duration-300 group-hover:bg-paper/85 group-hover:opacity-100">
          <p className="font-mono text-xs uppercase tracking-label text-ink">
            {project.title.en}
          </p>
          <p className="text-[0.72rem] text-ink-muted">
            {[project.type, project.location].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
    </Link>
  );
}
