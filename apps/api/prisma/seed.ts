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
    'company.tagline.ko': '공간을 짓는 사람들',
    'company.tagline.en': 'We build spaces that live',
    'company.description.ko':
      'Studio115는 주거와 상업 공간을 아우르는 인테리어 디자인 스튜디오입니다. 설계부터 시공, 스타일링까지 하나의 팀이 책임집니다. (플레이스홀더 문구)',
    'company.description.en':
      'Studio115 is an interior design studio working across residential and commercial spaces — design, build and styling handled by one team. (placeholder copy)',
    'contact.email': 'hello@studio115.kr',
    'contact.phone': '02-000-0000',
    'contact.address.ko': '서울특별시 성동구 어딘가로 115',
    'contact.address.en': '115 Somewhere-ro, Seongdong-gu, Seoul',
    'contact.hours': 'Mon–Fri 10:00–19:00',
    'social.instagram': 'https://instagram.com/',
    'social.blog': '',
    'stats.projects': '128',
    'stats.years': '12',
    'stats.awards': '9',
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
  location: string;
  areaSqm: number;
  year: number;
  featured: boolean;
  shots: number;
};

const PROJECTS: SeedProject[] = [
  {
    slug: 'hannam-penthouse',
    titleKo: '한남동 펜트하우스 리노베이션',
    titleEn: 'Hannam-dong Penthouse Renovation',
    summaryKo: '한강이 내려다보이는 78평 펜트하우스를 미니멀한 톤으로 재구성했습니다.',
    summaryEn: 'A 258㎡ penthouse overlooking the Han River, rebuilt in a calm minimal palette.',
    category: 'RESIDENTIAL',
    location: '서울 용산구',
    areaSqm: 258,
    year: 2024,
    featured: true,
    shots: 5,
  },
  {
    slug: 'seongsu-cafe-grey',
    titleKo: "성수동 카페 '그레이'",
    titleEn: "Seongsu Cafe 'Grey'",
    summaryKo: '노출 콘크리트와 스테인리스를 대비시킨 40평 규모의 스페셜티 카페.',
    summaryEn: 'A 132㎡ specialty cafe contrasting raw concrete with brushed stainless.',
    category: 'HOSPITALITY',
    location: '서울 성동구',
    areaSqm: 132,
    year: 2024,
    featured: true,
    shots: 4,
  },
  {
    slug: 'gangnam-office-remodel',
    titleKo: '강남 오피스 리모델링',
    titleEn: 'Gangnam Office Remodel',
    summaryKo: '80명 규모 IT 기업의 라운지·회의공간을 중심으로 한 업무공간 재설계.',
    summaryEn: 'Workspace redesign for an 80-person tech company, centred on lounge and meeting zones.',
    category: 'OFFICE',
    location: '서울 강남구',
    areaSqm: 640,
    year: 2023,
    featured: true,
    shots: 4,
  },
  {
    slug: 'pangyo-townhouse',
    titleKo: '판교 타운하우스',
    titleEn: 'Pangyo Townhouse',
    summaryKo: '3층 단독주택의 계단실을 집의 중심으로 끌어올린 프로젝트.',
    summaryEn: 'A three-storey house reorganised around a sculptural central stair.',
    category: 'RESIDENTIAL',
    location: '경기 성남시',
    areaSqm: 214,
    year: 2023,
    featured: false,
    shots: 3,
  },
  {
    slug: 'cheongdam-flagship',
    titleKo: '청담 플래그십 스토어',
    titleEn: 'Cheongdam Flagship Store',
    summaryKo: '패션 브랜드의 2개 층 플래그십. 아치와 마이크로토핑으로 통일감을 줬습니다.',
    summaryEn: 'A two-level fashion flagship unified through arches and micro-topping floors.',
    category: 'RETAIL',
    location: '서울 강남구',
    areaSqm: 320,
    year: 2022,
    featured: false,
    shots: 3,
  },
  {
    slug: 'jeju-stay-oreum',
    titleKo: '제주 스테이 오름',
    titleEn: 'Jeju Stay Oreum',
    summaryKo: '중산간 지대의 독채 스테이. 제주석과 편백을 주재료로 사용했습니다.',
    summaryEn: 'A stand-alone stay in Jeju\'s midslopes, built with basalt and hinoki.',
    category: 'HOSPITALITY',
    location: '제주 제주시',
    areaSqm: 96,
    year: 2022,
    featured: false,
    shots: 4,
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
      location: proj.location,
      areaSqm: proj.areaSqm,
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
    slug: 'residential',
    titleKo: '주거 인테리어',
    titleEn: 'Residential Interiors',
    descriptionKo: '아파트, 단독주택, 펜트하우스의 전체 리노베이션과 부분 리모델링.',
    descriptionEn: 'Full and partial renovations for apartments, houses and penthouses.',
    icon: 'home',
  },
  {
    slug: 'commercial',
    titleKo: '상업 공간',
    titleEn: 'Commercial & F&B',
    descriptionKo: '카페, 레스토랑, 편집숍 등 브랜드 경험을 담은 상업 공간 설계.',
    descriptionEn: 'Cafes, restaurants and shops designed around the brand experience.',
    icon: 'store',
  },
  {
    slug: 'office',
    titleKo: '오피스 디자인',
    titleEn: 'Office Design',
    descriptionKo: '조직의 일하는 방식을 반영한 업무공간 기획과 설계.',
    descriptionEn: 'Workplace planning and design that reflects how a team actually works.',
    icon: 'briefcase',
  },
  {
    slug: 'design-build',
    titleKo: '설계·시공',
    titleEn: 'Design & Build',
    descriptionKo: '설계부터 시공, 감리까지 한 팀이 책임지는 턴키 방식.',
    descriptionEn: 'One accountable team from drawings through construction and supervision.',
    icon: 'ruler',
  },
  {
    slug: 'styling',
    titleKo: '스타일링·FF&E',
    titleEn: 'Styling & FF&E',
    descriptionKo: '가구, 조명, 오브제 큐레이션과 촬영을 위한 스타일링.',
    descriptionEn: 'Furniture, lighting and object curation, plus styling for photography.',
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
        message: '30평대 아파트 전체 리모델링 상담 원합니다. 예산은 협의 가능합니다.',
        projectType: '아파트',
        budgetRange: 'FROM_50M_TO_100M',
        preferredContact: '전화',
        status: 'NEW',
      },
      {
        name: 'Daniel Park',
        phone: '010-2222-3333',
        email: 'daniel@example.com',
        message: 'Looking for an office fit-out in Seongsu, ~200㎡. Timeline Q3.',
        projectType: 'Office',
        budgetRange: 'OVER_100M',
        preferredContact: 'Email',
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
