import type { ProjectDto, ServiceDto } from '@studio115/shared';

// Used when the API is unreachable (e.g. before the DB is set up) so the site
// still renders during development. Mirrors apps/api/prisma/seed.ts.

const pic = (seed: string, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/studio115-${seed}/${w}/${h}`;

type Mini = {
  slug: string;
  ko: string;
  en: string;
  sko: string;
  sen: string;
  category: ProjectDto['category'];
  location: string;
  areaSqm: number;
  year: number;
  featured: boolean;
  shots: number;
};

const RAW: Mini[] = [
  { slug: 'hannam-penthouse', ko: '한남동 펜트하우스 리노베이션', en: 'Hannam-dong Penthouse Renovation', sko: '한강이 내려다보이는 78평 펜트하우스를 미니멀한 톤으로 재구성했습니다.', sen: 'A 258㎡ penthouse overlooking the Han River, rebuilt in a calm minimal palette.', category: 'RESIDENTIAL', location: '서울 용산구', areaSqm: 258, year: 2024, featured: true, shots: 4 },
  { slug: 'seongsu-cafe-grey', ko: "성수동 카페 '그레이'", en: "Seongsu Cafe 'Grey'", sko: '노출 콘크리트와 스테인리스를 대비시킨 40평 규모의 스페셜티 카페.', sen: 'A 132㎡ specialty cafe contrasting raw concrete with brushed stainless.', category: 'HOSPITALITY', location: '서울 성동구', areaSqm: 132, year: 2024, featured: true, shots: 4 },
  { slug: 'gangnam-office-remodel', ko: '강남 오피스 리모델링', en: 'Gangnam Office Remodel', sko: '80명 규모 IT 기업의 라운지·회의공간을 중심으로 한 업무공간 재설계.', sen: 'Workspace redesign for an 80-person tech company, centred on lounge and meeting zones.', category: 'OFFICE', location: '서울 강남구', areaSqm: 640, year: 2023, featured: true, shots: 3 },
  { slug: 'pangyo-townhouse', ko: '판교 타운하우스', en: 'Pangyo Townhouse', sko: '3층 단독주택의 계단실을 집의 중심으로 끌어올린 프로젝트.', sen: 'A three-storey house reorganised around a sculptural central stair.', category: 'RESIDENTIAL', location: '경기 성남시', areaSqm: 214, year: 2023, featured: false, shots: 3 },
  { slug: 'cheongdam-flagship', ko: '청담 플래그십 스토어', en: 'Cheongdam Flagship Store', sko: '패션 브랜드의 2개 층 플래그십. 아치와 마이크로토핑으로 통일감을 줬습니다.', sen: 'A two-level fashion flagship unified through arches and micro-topping floors.', category: 'RETAIL', location: '서울 강남구', areaSqm: 320, year: 2022, featured: false, shots: 3 },
  { slug: 'jeju-stay-oreum', ko: '제주 스테이 오름', en: 'Jeju Stay Oreum', sko: '중산간 지대의 독채 스테이. 제주석과 편백을 주재료로 사용했습니다.', sen: "A stand-alone stay in Jeju's midslopes, built with basalt and hinoki.", category: 'HOSPITALITY', location: '제주 제주시', areaSqm: 96, year: 2022, featured: false, shots: 4 },
];

export const FALLBACK_PROJECTS: ProjectDto[] = RAW.map((r, i) => ({
  id: `fallback-${r.slug}`,
  slug: r.slug,
  title: { ko: r.ko, en: r.en },
  summary: { ko: r.sko, en: r.sen },
  description: {
    ko: `${r.sko}\n\n(상세 설명 플레이스홀더 — 프로젝트 배경, 자재, 공정, 결과를 여기에 작성합니다.)`,
    en: `${r.sen}\n\n(Placeholder body — write the brief, materials, process and outcome here.)`,
  },
  category: r.category,
  location: r.location,
  areaSqm: r.areaSqm,
  year: r.year,
  coverImageUrl: pic(`${r.slug}-1`),
  images: Array.from({ length: r.shots }, (_, s) => ({
    id: `${r.slug}-img-${s + 1}`,
    url: pic(`${r.slug}-${s + 1}`),
    alt: `${r.en} — ${s + 1}`,
    order: s,
  })),
  featured: r.featured,
  published: true,
  order: i,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}));

export const FALLBACK_SERVICES: ServiceDto[] = [
  { slug: 'residential', ko: '주거 인테리어', en: 'Residential Interiors', dko: '아파트, 단독주택, 펜트하우스의 전체 리노베이션과 부분 리모델링.', den: 'Full and partial renovations for apartments, houses and penthouses.', icon: 'home' },
  { slug: 'commercial', ko: '상업 공간', en: 'Commercial & F&B', dko: '카페, 레스토랑, 편집숍 등 브랜드 경험을 담은 상업 공간 설계.', den: 'Cafes, restaurants and shops designed around the brand experience.', icon: 'store' },
  { slug: 'office', ko: '오피스 디자인', en: 'Office Design', dko: '조직의 일하는 방식을 반영한 업무공간 기획과 설계.', den: 'Workplace planning and design that reflects how a team actually works.', icon: 'briefcase' },
  { slug: 'design-build', ko: '설계·시공', en: 'Design & Build', dko: '설계부터 시공, 감리까지 한 팀이 책임지는 턴키 방식.', den: 'One accountable team from drawings through construction and supervision.', icon: 'ruler' },
  { slug: 'styling', ko: '스타일링·FF&E', en: 'Styling & FF&E', dko: '가구, 조명, 오브제 큐레이션과 촬영을 위한 스타일링.', den: 'Furniture, lighting and object curation, plus styling for photography.', icon: 'sofa' },
].map((s, i) => ({
  id: `fallback-svc-${s.slug}`,
  slug: s.slug,
  title: { ko: s.ko, en: s.en },
  description: { ko: s.dko, en: s.den },
  icon: s.icon,
  order: i,
  published: true,
}));

export const FALLBACK_SETTINGS: Record<string, string> = {
  'company.name': 'Studio115',
  'company.tagline.ko': '공간을 짓는 사람들',
  'company.tagline.en': 'We build spaces that live',
  'contact.email': 'hello@studio115.kr',
  'contact.phone': '02-000-0000',
  'contact.address.ko': '서울특별시 성동구 어딘가로 115',
  'contact.address.en': '115 Somewhere-ro, Seongdong-gu, Seoul',
  'contact.hours': 'Mon–Fri 10:00–19:00',
  'social.instagram': 'https://instagram.com/',
  'stats.projects': '128',
  'stats.years': '12',
  'stats.awards': '9',
};
