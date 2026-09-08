import type {
  ContractStatus,
  InquiryStatus,
  MediaType,
  ProjectScope,
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

export interface CategoryDto {
  id: string;
  slug: string;
  name: LocalizedText;
  order: number;
  projectCount?: number;
}

/** Compact category reference embedded in a project. */
export interface CategoryRefDto {
  id: string;
  slug: string;
  name: LocalizedText;
}

export interface ProjectMediaDto {
  id: string;
  type: MediaType;
  url: string;
  posterUrl: string | null;
  alt: string | null;
  order: number;
}

export interface ProjectDto {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  /** Rich HTML. */
  description: LocalizedText;
  category: CategoryRefDto;
  type: string | null;
  location: string | null;
  sizeLabel: string | null;
  areaSqm: number | null;
  involvement: string | null;
  completionDate: string | null;
  photography: string | null;
  year: number | null;
  coverImageUrl: string | null;
  media: ProjectMediaDto[];
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

export interface PageDto {
  slug: string;
  title: LocalizedText;
  /** Rich HTML. */
  body: LocalizedText;
  updatedAt: string;
}

export interface InquiryDto {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  industry: string | null;
  businessName: string | null;
  region: string | null;
  addressDetail: string | null;
  scopes: ProjectScope[];
  contractStatus: ContractStatus | null;
  message: string;
  budgetText: string | null;
  attachments: string[];
  status: InquiryStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface SiteSettingDto {
  key: string;
  value: string;
}

export interface InstagramMediaDto {
  id: string;
  caption: string | null;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  imageUrl: string;
  timestamp: string | null;
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
