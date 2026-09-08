/**
 * Domain constants shared by the API, the public site and the admin app.
 * These are plain strings — SQL Server has no enum type, so validation lives
 * in the API DTOs. Project categories are a DB table (`Category`), not a const.
 */

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

export const MEDIA_TYPES = ['IMAGE', 'VIDEO'] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';

/** Slugs of the editable long-form pages (`Page` table). */
export const EDITABLE_PAGE_SLUGS = ['about', 'terms', 'privacy'] as const;
export type EditablePageSlug = (typeof EDITABLE_PAGE_SLUGS)[number];
