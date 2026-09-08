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

export const USER_ROLES = ['ADMIN', 'EDITOR'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';

/** Free-form option lists surfaced in the contact form / admin filters. */
export const BUDGET_RANGES = [
  'UNDER_20M',
  'FROM_20M_TO_50M',
  'FROM_50M_TO_100M',
  'OVER_100M',
  'UNDECIDED',
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];
