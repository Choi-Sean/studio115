import type {
  Category,
  Inquiry,
  Page,
  Project,
  ProjectMedia,
  Service,
} from '@prisma/client';
import type {
  CategoryDto,
  CategoryRefDto,
  ContractStatus,
  InquiryDto,
  MediaType,
  PageDto,
  ProjectDto,
  ProjectMediaDto,
  ProjectScope,
  ServiceDto,
} from '@studio115/shared';

export function toCategoryRef(c: Category): CategoryRefDto {
  return { id: c.id, slug: c.slug, name: { ko: c.nameKo, en: c.nameEn } };
}

export function toCategoryDto(
  c: Category & { _count?: { projects: number } },
): CategoryDto {
  return {
    id: c.id,
    slug: c.slug,
    name: { ko: c.nameKo, en: c.nameEn },
    order: c.order,
    projectCount: c._count?.projects,
  };
}

export function toProjectMediaDto(m: ProjectMedia): ProjectMediaDto {
  return {
    id: m.id,
    type: m.type as MediaType,
    url: m.url,
    posterUrl: m.posterUrl,
    alt: m.alt,
    order: m.order,
  };
}

export function toProjectDto(
  p: Project & { category: Category; media?: ProjectMedia[] },
): ProjectDto {
  return {
    id: p.id,
    slug: p.slug,
    title: { ko: p.titleKo, en: p.titleEn },
    summary: { ko: p.summaryKo, en: p.summaryEn },
    description: { ko: p.descriptionKo, en: p.descriptionEn },
    category: toCategoryRef(p.category),
    type: p.type,
    location: p.location,
    sizeLabel: p.sizeLabel,
    areaSqm: p.areaSqm,
    involvement: p.involvement,
    completionDate: p.completionDate,
    photography: p.photography,
    year: p.year,
    coverImageUrl: p.coverImageUrl,
    media: [...(p.media ?? [])]
      .sort((a, b) => a.order - b.order)
      .map(toProjectMediaDto),
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

export function toPageDto(p: Page): PageDto {
  return {
    slug: p.slug,
    title: { ko: p.titleKo, en: p.titleEn },
    body: { ko: p.bodyKo, en: p.bodyEn },
    updatedAt: p.updatedAt.toISOString(),
  };
}

function parseAttachments(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function toInquiryDto(i: Inquiry): InquiryDto {
  return {
    id: i.id,
    name: i.name,
    phone: i.phone,
    email: i.email,
    industry: i.industry,
    businessName: i.businessName,
    region: i.region,
    addressDetail: i.addressDetail,
    scopes: (i.scopes ? i.scopes.split(',') : []).filter(
      Boolean,
    ) as ProjectScope[],
    contractStatus: (i.contractStatus as ContractStatus | null) || null,
    message: i.message,
    budgetText: i.budgetText,
    attachments: parseAttachments(i.attachmentsJson),
    status: i.status as InquiryDto['status'],
    adminNote: i.adminNote,
    createdAt: i.createdAt.toISOString(),
  };
}
