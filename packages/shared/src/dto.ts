import type {
  BudgetRange,
  InquiryStatus,
  ProjectCategory,
  UserRole,
} from './enums';

export interface LocalizedText {
  ko: string;
  en: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectImageDto {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface ProjectDto {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  category: ProjectCategory;
  location: string | null;
  areaSqm: number | null;
  year: number | null;
  coverImageUrl: string | null;
  images: ProjectImageDto[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDto {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string | null;
  order: number;
  published: boolean;
}

export interface InquiryDto {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  projectType: string | null;
  budgetRange: BudgetRange | null;
  preferredContact: string | null;
  status: InquiryStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface SiteSettingDto {
  key: string;
  value: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponseDto {
  accessToken: string;
  user: AuthUserDto;
}
