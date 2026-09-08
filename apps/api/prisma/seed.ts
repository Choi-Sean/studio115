/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** Placeholder imagery — swap for real photos via the admin later. */
const img = (seed: string, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/studio115-${seed}/${w}/${h}`;

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@studio115.kr';
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'studio115!admin';
  const name = process.env.ADMIN_SEED_NAME ?? 'Studio115 Admin';

  await prisma.user.upsert({
    where: { email },
    update: { name, role: 'ADMIN' },
    create: { email, name, role: 'ADMIN', passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`  admin: ${email} / ${password}`);
}

async function seedSettings() {
  const settings: Record<string, string> = {
    'company.name': 'Studio115',
    'company.nameKo': '스튜디오115',
    'company.tagline.ko': '자신의 가치를 따르세요',
    'company.tagline.en': 'Follow your own values',
    'about.lead.en':
      'STUDIO115 is an interior and architecture studio creating residential and commercial spaces where timeless materials meet a considered, lived-in calm.',
    'about.lead.ko':
      '스튜디오115는 주거와 상업 공간을 다루는 인테리어·건축 스튜디오입니다. 오래 견디는 재료와 절제된 디테일로, 시간이 지나도 편안한 공간을 만듭니다.',
    'about.body.en':
      'Established with a commitment to excellence and a keen eye for detail, the studio blends restrained elegance with everyday function. From the first survey to post-handover care, one team owns design and construction.',
    'about.body.ko':
      '설계부터 시공, 사후관리까지 하나의 팀이 책임집니다. 현장 실측과 생활 인터뷰에서 시작해 도면과 3D로 충분히 검토한 뒤 착공하며, 시공 중에도 디자이너가 현장을 지킵니다. (플레이스홀더 문구)',
    'contact.email': 'studio115@naver.com',
    'contact.phone': '070-4177-8699',
    'contact.address.ko': '경기도 파주시 해울2길 16 (다율동) 610호',
    'contact.address.en': '115, Haeul 2-gil, Paju-si, Gyeonggi-do, Korea',
    'contact.hours': 'Mon–Fri 10:00–19:00',
    'social.instagram': 'https://instagram.com/studio115',
    // Footer legal block (사업자 정보)
    'legal.bizName': '스튜디오115',
    'legal.owner': '김서우',
    'legal.address': '경기도 파주시 해울2길 16 (다율동) 610호',
    'legal.phone': '070-4177-8699',
    'legal.email': 'studio115@naver.com',
    'legal.bizNumber': '414-15-01143',
    'legal.mailOrderNumber': '2024-경기파주-0633',
    'legal.hosting': '(주)아임웹',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`  settings: ${Object.keys(settings).length} keys`);
}

type SeedProject = {
  slug: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'OFFICE' | 'HOSPITALITY' | 'RETAIL';
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

const PROJECTS: SeedProject[] = [
  {
    slug: 'villa-travertine',
    titleKo: '빌라 트래버틴',
    titleEn: 'VILLA TRAVERTINE',
    summaryKo: '트래버틴과 오크로 마감한 전용 82평 빌라. 거실을 집의 중심으로 두었습니다.',
    summaryEn: 'A 271㎡ villa finished in travertine and oak, planned around a central living hall.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Cheongdam-dong, Seoul',
    sizeLabel: '271 m²',
    areaSqm: 271,
    involvement: 'Design, Construction',
    completionDate: '08.2024',
    photography: 'Donggyu Kim',
    year: 2024,
    featured: true,
    shots: 5,
  },
  {
    slug: 'grid-seongsu',
    titleKo: '그리드 성수',
    titleEn: 'GRID SEONGSU',
    summaryKo: '노출 콘크리트 골조를 그대로 살린 성수동 편집숍 겸 카페.',
    summaryEn: 'A Seongsu concept store and cafe that keeps its raw concrete frame exposed.',
    category: 'COMMERCIAL',
    type: 'Retail, Cafe',
    location: 'Seongsu-dong, Seoul',
    sizeLabel: '164 m²',
    areaSqm: 164,
    involvement: 'Design, Construction',
    completionDate: '03.2024',
    photography: 'Donggyu Kim',
    year: 2024,
    featured: true,
    shots: 4,
  },
  {
    slug: 'miwoococo-house',
    titleKo: '미우코코 하우스',
    titleEn: 'MIWOOCOCO HOUSE',
    summaryKo: '두 세대가 함께 사는 협소주택. 계단실을 가족 공용 공간으로 확장했습니다.',
    summaryEn: 'A narrow two-family house where the stair core opens into shared family space.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Yeonhui-dong, Seoul',
    sizeLabel: '138 m²',
    areaSqm: 138,
    involvement: 'Design',
    completionDate: '11.2023',
    photography: 'Sunghwan Yoon',
    year: 2023,
    featured: true,
    shots: 4,
  },
  {
    slug: 'tower-palace',
    titleKo: '타워팰리스',
    titleEn: 'TOWER PALACE',
    summaryKo: '고층 아파트 전면 리노베이션. 조망을 살리는 저채도 팔레트.',
    summaryEn: 'A full high-rise apartment renovation in a low-chroma palette that frames the view.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Dogok-dong, Seoul',
    sizeLabel: '198 m²',
    areaSqm: 198,
    involvement: 'Design, Construction',
    completionDate: '06.2023',
    photography: 'Donggyu Kim',
    year: 2023,
    featured: false,
    shots: 3,
  },
  {
    slug: '109hannam',
    titleKo: '109 한남',
    titleEn: '109HANNAM',
    summaryKo: '한강이 보이는 펜트하우스. 석재와 우드의 대비로 층고를 강조했습니다.',
    summaryEn: 'A river-facing penthouse where stone and wood contrast to emphasise ceiling height.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Hannam-dong, Seoul',
    sizeLabel: '258 m²',
    areaSqm: 258,
    involvement: 'Design, Construction',
    completionDate: '12.2022',
    photography: 'Donggyu Kim',
    year: 2022,
    featured: false,
    shots: 4,
  },
  {
    slug: 'yangpyeong-house',
    titleKo: '양평 주택',
    titleEn: 'YANGPYEONG HOUSE',
    summaryKo: '전원 단독주택. 편백과 제주석을 주재료로 사용했습니다.',
    summaryEn: 'A countryside house built mainly with hinoki and basalt.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Yangpyeong-gun, Gyeonggi',
    sizeLabel: '112 m²',
    areaSqm: 112,
    involvement: 'Design, Construction',
    completionDate: '05.2022',
    photography: 'Sunghwan Yoon',
    year: 2022,
    featured: false,
    shots: 3,
  },
  {
    slug: 'cheongdam-c-villa',
    titleKo: '청담 C.빌라',
    titleEn: 'CHEONGDAM C.VILLA',
    summaryKo: '복층 빌라. 아치 개구부로 두 층의 시선을 연결했습니다.',
    summaryEn: 'A duplex villa where arched openings link sightlines between the two floors.',
    category: 'RESIDENTIAL',
    type: 'Residence',
    location: 'Cheongdam-dong, Seoul',
    sizeLabel: '221 m²',
    areaSqm: 221,
    involvement: 'Design',
    completionDate: '09.2021',
    photography: 'Donggyu Kim',
    year: 2021,
    featured: false,
    shots: 3,
  },
];

async function seedProjects() {
  for (let p = 0; p < PROJECTS.length; p++) {
    const proj = PROJECTS[p];
    const images = Array.from({ length: proj.shots }, (_, i) => ({
      url: img(`${proj.slug}-${i + 1}`),
      alt: `${proj.titleEn} — ${i + 1}`,
      order: i,
    }));
    const base = {
      titleKo: proj.titleKo,
      titleEn: proj.titleEn,
      summaryKo: proj.summaryKo,
      summaryEn: proj.summaryEn,
      descriptionKo: `${proj.summaryKo}\n\n(상세 설명 플레이스홀더 — 프로젝트 배경, 자재, 공정, 결과를 여기에 작성합니다.)`,
      descriptionEn: `${proj.summaryEn}\n\n(Placeholder body — write the brief, materials, process and outcome here.)`,
      category: proj.category,
      type: proj.type,
      location: proj.location,
      sizeLabel: proj.sizeLabel,
      areaSqm: proj.areaSqm,
      involvement: proj.involvement,
      completionDate: proj.completionDate,
      photography: proj.photography,
      year: proj.year,
      featured: proj.featured,
      published: true,
      order: p,
      coverImageUrl: img(`${proj.slug}-1`),
    };
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: { ...base, images: { deleteMany: {}, create: images } },
      create: { slug: proj.slug, ...base, images: { create: images } },
    });
  }
  console.log(`  projects: ${PROJECTS.length}`);
}

const SERVICES = [
  {
    slug: 'residential-design',
    titleKo: '주거 디자인',
    titleEn: 'Residential Design',
    descriptionKo: '아파트, 단독주택, 빌라의 전체 리노베이션과 부분 리모델링.',
    descriptionEn: 'Full and partial renovations for apartments, houses and villas.',
    icon: 'home',
  },
  {
    slug: 'commercial-design',
    titleKo: '상업 디자인',
    titleEn: 'Commercial Design',
    descriptionKo: '카페, 리테일, 오피스 등 브랜드 경험을 담은 상업 공간 설계.',
    descriptionEn: 'Cafes, retail and offices designed around the brand experience.',
    icon: 'store',
  },
  {
    slug: 'architecture',
    titleKo: '건축',
    titleEn: 'Architecture',
    descriptionKo: '신축·대수선 설계와 인허가, 감리.',
    descriptionEn: 'New-build and major-renovation design, permits and supervision.',
    icon: 'ruler',
  },
  {
    slug: 'furniture-design',
    titleKo: '가구 디자인',
    titleEn: 'Furniture Design',
    descriptionKo: '공간에 맞춘 제작 가구와 FF&E 큐레이션.',
    descriptionEn: 'Bespoke built-in furniture and FF&E curation.',
    icon: 'sofa',
  },
];

async function seedServices() {
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, order: i, published: true },
      create: { ...s, order: i, published: true },
    });
  }
  console.log(`  services: ${SERVICES.length}`);
}

async function seedInquiries() {
  const count = await prisma.inquiry.count();
  if (count > 0) {
    console.log(`  inquiries: skipped (${count} already present)`);
    return;
  }
  await prisma.inquiry.createMany({
    data: [
      {
        name: '김서연',
        phone: '010-1234-5678',
        email: 'seoyeon@example.com',
        industry: '카페',
        businessName: '(예비) 그레이 로스터스',
        region: '서울 성동구 성수동',
        addressDetail: '연무장길 00',
        scopes: ['CONSTRUCTION', 'DESIGN'],
        contractStatus: 'IN_PROGRESS',
        message:
          '1층 상가, 전용 18평. 실측 가능하고 공사예정일은 다음 달, 오픈은 3개월 뒤 목표입니다.',
        budgetText: '8천만원 내외',
        status: 'NEW',
      },
      {
        name: 'Daniel Park',
        phone: '010-2222-3333',
        email: 'daniel@example.com',
        industry: 'Office',
        region: 'Seoul, Seongsu',
        scopes: ['DESIGN', 'BRANDING'],
        contractStatus: 'SIGNED',
        message: 'Office fit-out, ~200㎡, 5F. Survey OK. Construction from Q3.',
        budgetText: 'Around ₩150M',
        status: 'IN_PROGRESS',
      },
    ],
  });
  console.log('  inquiries: 2 sample rows');
}

async function main() {
  console.log('Seeding Studio115…');
  await seedAdmin();
  await seedSettings();
  await seedProjects();
  await seedServices();
  await seedInquiries();
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
