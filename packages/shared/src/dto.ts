import type {
  ContractStatus,
  InquiryStatus,
  ProjectCategory,
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
  /** WORK detail meta (보통공간 style). */
  type: string | null; // "Salon", "Cafe", "Office"…
  location: string | null; // "Okjeongdong-ro, Yangju-si"
  sizeLabel: string | null; // "122 m²"
  areaSqm: number | null;
  involvement: string | null; // "Design, Construction"
  completionDate: string | null; // "12.2023"
  photography: string | null; // credit
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
