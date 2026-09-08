import type {
  Inquiry,
  Project,
  ProjectImage,
  Service,
} from '@prisma/client';
import type {
  InquiryDto,
  ProjectDto,
  ProjectImageDto,
  ServiceDto,
} from '@studio115/shared';

export function toProjectImageDto(i: ProjectImage): ProjectImageDto {
  return { id: i.id, url: i.url, alt: i.alt, order: i.order };
}

export function toProjectDto(
  p: Project & { images?: ProjectImage[] },
): ProjectDto {
  return {
    id: p.id,
    slug: p.slug,
    title: { ko: p.titleKo, en: p.titleEn },
    summary: { ko: p.summaryKo, en: p.summaryEn },
    description: { ko: p.descriptionKo, en: p.descriptionEn },
    category: p.category,
    location: p.location,
    areaSqm: p.areaSqm,
    year: p.year,
    coverImageUrl: p.coverImageUrl,
    images: [...(p.images ?? [])]
      .sort((a, b) => a.order - b.order)
      .map(toProjectImageDto),
    featured: p.featured,
    published: p.published,
    order: p.order,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function toServiceDto(s: Service): ServiceDto {
  return {
    id: s.id,
    slug: s.slug,
    title: { ko: s.titleKo, en: s.titleEn },
    description: { ko: s.descriptionKo, en: s.descriptionEn },
    icon: s.icon,
    order: s.order,
    published: s.published,
  };
}

export function toInquiryDto(i: Inquiry): InquiryDto {
  return {
    id: i.id,
    name: i.name,
    phone: i.phone,
    email: i.email,
    message: i.message,
    projectType: i.projectType,
    budgetRange: i.budgetRange,
    preferredContact: i.preferredContact,
    status: i.status,
    adminNote: i.adminNote,
    createdAt: i.createdAt.toISOString(),
  };
}
