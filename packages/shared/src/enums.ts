/**
 * Domain constants shared by the API, the public site and the admin app.
 * Keep these in sync with `apps/api/prisma/schema.prisma` enums.
 */

export const PROJECT_CATEGORIES = [
  'RESIDENTIAL',
  'COMMERCIAL',
  'OFFICE',
  'HOSPITALITY',
  'RETAIL',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const INQUIRY_STATUSES = [
  'NEW',
  'IN_PROGRESS',
  'CONTACTED',
  'CLOSED',
  'SPAM',
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Contact form — 프로젝트 유형 (multi-select). */
export const PROJECT_SCOPES = ['CONSTRUCTION', 'DESIGN', 'BRANDING'] as const;
export type ProjectScope = (typeof PROJECT_SCOPES)[number];

/** Contact form — 부동산 계약 여부. */
export const CONTRACT_STATUSES = ['SIGNED', 'IN_PROGRESS', 'NONE'] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const USER_ROLES = ['ADMIN', 'EDITOR'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';
