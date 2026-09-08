import type {
  CategoryDto,
  PageDto,
  ProjectDto,
  ServiceDto,
} from '@studio115/shared';

// Used when the API is unreachable (e.g. before the DB is set up) so the site
// still renders during development. Mirrors apps/api/prisma/seed.ts.

const pic = (seed: string, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/studio115-${seed}/${w}/${h}`;

export const FALLBACK_CATEGORIES: CategoryDto[] = [
  { slug: 'residential', nameKo: '주거', nameEn: 'RESIDENTIAL' },
  { slug: 'commercial', nameKo: '상업', nameEn: 'COMMERCIAL' },
  { slug: 'office', nameKo: '오피스', nameEn: 'OFFICE' },
  { slug: 'hospitality', nameKo: '호스피탈리티', nameEn: 'HOSPITALITY' },
  { slug: 'retail', nameKo: '리테일', nameEn: 'RETAIL' },
].map((c, i) => ({
  id: `fb-cat-${c.slug}`,
  slug: c.slug,
  name: { ko: c.nameKo, en: c.nameEn },
  order: i,
}));

const catRef = (slug: string) => {
  const c = FALLBACK_CATEGORIES.find((x) => x.slug === slug)!;
  return { id: c.id, slug: c.slug, name: c.name };
};

type Mini = {
  slug: string;
  cat: string;
  ko: string;
  en: string;
  sko: string;
  sen: string;
  type: string;
  location: string;
  sizeLabel: string;
  areaSqm: number;
  involvement: string;
  completionDate: string;
  photography: string;
  year: number;
  featured: boolean;
  shots: number;
};

const RAW: Mini[] = [
  { slug: 'villa-travertine', cat: 'residential', ko: '빌라 트래버틴', en: 'VILLA TRAVERTINE', sko: '트래버틴과 오크로 마감한 전용 82평 빌라.', sen: 'A 271㎡ villa finished in travertine and oak.', type: 'Residence', location: 'Cheongdam-dong, Seoul', sizeLabel: '271 m²', areaSqm: 271, involvement: 'Design, Construction', completionDate: '08.2024', photography: 'Donggyu Kim', year: 2024, featured: true, shots: 5 },
  { slug: 'grid-seongsu', cat: 'commercial', ko: '그리드 성수', en: 'GRID SEONGSU', sko: '노출 콘크리트 골조를 살린 성수동 편집숍 겸 카페.', sen: 'A Seongsu concept store and cafe with an exposed concrete frame.', type: 'Retail, Cafe', location: 'Seongsu-dong, Seoul', sizeLabel: '164 m²', areaSqm: 164, involvement: 'Design, Construction', completionDate: '03.2024', photography: 'Donggyu Kim', year: 2024, featured: true, shots: 4 },
  { slug: 'miwoococo-house', cat: 'residential', ko: '미우코코 하우스', en: 'MIWOOCOCO HOUSE', sko: '두 세대가 함께 사는 협소주택.', sen: 'A narrow two-family house organised around its stair core.', type: 'Residence', location: 'Yeonhui-dong, Seoul', sizeLabel: '138 m²', areaSqm: 138, involvement: 'Design', completionDate: '11.2023', photography: 'Sunghwan Yoon', year: 2023, featured: true, shots: 4 },
  { slug: 'tower-palace', cat: 'residential', ko: '타워팰리스', en: 'TOWER PALACE', sko: '고층 아파트 전면 리노베이션.', sen: 'A full high-rise apartment renovation.', type: 'Residence', location: 'Dogok-dong, Seoul', sizeLabel: '198 m²', areaSqm: 198, involvement: 'Design, Construction', completionDate: '06.2023', photography: 'Donggyu Kim', year: 2023, featured: false, shots: 3 },
  { slug: '109hannam', cat: 'residential', ko: '109 한남', en: '109HANNAM', sko: '한강이 보이는 펜트하우스.', sen: 'A river-facing penthouse.', type: 'Residence', location: 'Hannam-dong, Seoul', sizeLabel: '258 m²', areaSqm: 258, involvement: 'Design, Construction', completionDate: '12.2022', photography: 'Donggyu Kim', year: 2022, featured: false, shots: 4 },
  { slug: 'yangpyeong-house', cat: 'residential', ko: '양평 주택', en: 'YANGPYEONG HOUSE', sko: '전원 단독주택. 편백과 제주석을 주재료로.', sen: 'A countryside house built mainly with hinoki and basalt.', type: 'Residence', location: 'Yangpyeong-gun, Gyeonggi', sizeLabel: '112 m²', areaSqm: 112, involvement: 'Design, Construction', completionDate: '05.2022', photography: 'Sunghwan Yoon', year: 2022, featured: false, shots: 3 },
  { slug: 'cheongdam-c-villa', cat: 'residential', ko: '청담 C.빌라', en: 'CHEONGDAM C.VILLA', sko: '복층 빌라. 아치 개구부로 두 층의 시선을 연결.', sen: 'A duplex villa linked by arched openings.', type: 'Residence', location: 'Cheongdam-dong, Seoul', sizeLabel: '221 m²', areaSqm: 221, involvement: 'Design', completionDate: '09.2021', photography: 'Donggyu Kim', year: 2021, featured: false, shots: 3 },
];

export const FALLBACK_PROJECTS: ProjectDto[] = RAW.map((r, i) => ({
  id: `fallback-${r.slug}`,
  slug: r.slug,
  title: { ko: r.ko, en: r.en },
  summary: { ko: r.sko, en: r.sen },
  description: {
    ko: `<p>${r.sko}</p><p><em>(상세 설명 플레이스홀더)</em></p>`,
    en: `<p>${r.sen}</p><p><em>(Placeholder body)</em></p>`,
  },
  category: catRef(r.cat),
  type: r.type,
  location: r.location,
  sizeLabel: r.sizeLabel,
  areaSqm: r.areaSqm,
  involvement: r.involvement,
  completionDate: r.completionDate,
  photography: r.photography,
  year: r.year,
  coverImageUrl: pic(`${r.slug}-1`),
  media: Array.from({ length: r.shots }, (_, s) => ({
    id: `${r.slug}-m-${s + 1}`,
    type: 'IMAGE' as const,
    url: pic(`${r.slug}-${s + 1}`),
    posterUrl: null,
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
  { slug: 'residential-design', ko: '주거 디자인', en: 'Residential Design', dko: '아파트, 단독주택, 빌라의 전체 리노베이션과 부분 리모델링.', den: 'Full and partial renovations for apartments, houses and villas.', icon: 'home' },
  { slug: 'commercial-design', ko: '상업 디자인', en: 'Commercial Design', dko: '카페, 리테일, 오피스 등 브랜드 경험을 담은 상업 공간 설계.', den: 'Cafes, retail and offices designed around the brand experience.', icon: 'store' },
  { slug: 'architecture', ko: '건축', en: 'Architecture', dko: '신축·대수선 설계와 인허가, 감리.', den: 'New-build and major-renovation design, permits and supervision.', icon: 'ruler' },
  { slug: 'furniture-design', ko: '가구 디자인', en: 'Furniture Design', dko: '공간에 맞춘 제작 가구와 FF&E 큐레이션.', den: 'Bespoke built-in furniture and FF&E curation.', icon: 'sofa' },
].map((s, i) => ({
  id: `fallback-svc-${s.slug}`,
  slug: s.slug,
  title: { ko: s.ko, en: s.en },
  description: { ko: s.dko, en: s.den },
  icon: s.icon,
  order: i,
  published: true,
}));

export const FALLBACK_PAGES: Record<string, PageDto> = {
  about: {
    slug: 'about',
    title: { ko: 'ABOUT', en: 'ABOUT' },
    body: {
      ko: '<p>스튜디오115는 주거와 상업 공간을 다루는 인테리어·건축 스튜디오입니다. 오래 견디는 재료와 절제된 디테일로, 시간이 지나도 편안한 공간을 만듭니다.</p>',
      en: '<p>STUDIO115 is an interior and architecture studio creating residential and commercial spaces where timeless materials meet a considered, lived-in calm.</p>',
    },
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  terms: {
    slug: 'terms',
    title: { ko: '이용약관', en: 'Terms of Use' },
    body: {
      ko: '<p>본 약관은 스튜디오115가 운영하는 웹사이트의 이용 조건을 규정합니다. (플레이스홀더)</p>',
      en: '<p>These terms govern the use of the website operated by Studio115. (Placeholder)</p>',
    },
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  privacy: {
    slug: 'privacy',
    title: { ko: '개인정보처리방침', en: 'Privacy Policy' },
    body: {
      ko: '<p>스튜디오115는 개인정보 보호법에 따라 개인정보 처리방침을 수립·공개합니다. (플레이스홀더)</p>',
      en: '<p>Studio115 establishes this privacy policy under the Personal Information Protection Act. (Placeholder)</p>',
    },
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

export const FALLBACK_SETTINGS: Record<string, string> = {
  'company.name': 'Studio115',
  'company.nameKo': '스튜디오115',
  'company.tagline.ko': '자신의 가치를 따르세요',
  'company.tagline.en': 'Follow your own values',
  'contact.email': 'studio115@naver.com',
  'contact.phone': '',
  'contact.address.ko':
    '경기도 남양주시 다산중앙로146번길 12-16, 2층 202-a27호 (다산동)',
  'contact.address.en':
    '2F 202-a27, 12-16 Dasanjungang-ro 146beon-gil, Namyangju-si, Gyeonggi-do, Korea',
  'contact.hours': 'Mon–Fri 10:00–19:00',
  'social.instagram': 'https://www.instagram.com/studio_115_',
  'legal.bizName': '스튜디오115',
  'legal.owner': '한보름',
  'legal.address':
    '경기도 남양주시 다산중앙로146번길 12-16, 2층 202-a27호 (다산동)',
  'legal.phone': '',
  'legal.email': 'gksqhfma0306@naver.com',
  'legal.bizNumber': '249-48-00951',
  'legal.mailOrderNumber': '',
  'legal.hosting': '위대한 Sean Choi',
  'footer.notice': '최상화에게 440만원 입금 부탁드립니다 🙏',
};
