/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (seed: string, w = 1600, h = 1067) =>
  `https://picsum.photos/seed/studio115-${seed}/${w}/${h}`;

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin';
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'bboyong';
  const name = process.env.ADMIN_SEED_NAME ?? 'Studio115 Admin';
  await prisma.user.upsert({
    where: { email },
    update: { name, role: 'ADMIN' },
    create: { email, name, role: 'ADMIN', passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`  admin: ${email} / ${password}`);
}

const CATEGORIES = [
  { slug: 'residential', nameKo: '주거', nameEn: 'RESIDENTIAL' },
  { slug: 'commercial', nameKo: '상업', nameEn: 'COMMERCIAL' },
  { slug: 'office', nameKo: '오피스', nameEn: 'OFFICE' },
  { slug: 'hospitality', nameKo: '호스피탈리티', nameEn: 'HOSPITALITY' },
  { slug: 'retail', nameKo: '리테일', nameEn: 'RETAIL' },
];

async function seedCategories() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameKo: c.nameKo, nameEn: c.nameEn, order: i },
      create: { ...c, order: i },
    });
  }
  console.log(`  categories: ${CATEGORIES.length}`);
}

async function seedSettings() {
  const settings: Record<string, string> = {
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
    // Footer legal block — from 사업자등록증 (249-48-00951)
    'legal.bizName': '스튜디오115',
    'legal.owner': '한보름',
    'legal.address':
      '경기도 남양주시 다산중앙로146번길 12-16, 2층 202-a27호 (다산동)',
    'legal.phone': '',
    'legal.email': 'gksqhfma0306@naver.com',
    'legal.bizNumber': '249-48-00951',
    'legal.mailOrderNumber': '',
    'legal.hosting': '위대한 Sean Choi',
    // TODO(joke): 클라이언트 전달/실배포 전 삭제 (admin 사이트 설정에서 비우면 됨)
    'footer.notice': '최상화에게 440만원 입금 부탁드립니다 🙏',
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

const PAGES = [
  {
    slug: 'about',
    titleKo: 'ABOUT',
    titleEn: 'ABOUT',
    bodyEn:
      '<p>STUDIO115 is an interior and architecture studio creating residential and commercial spaces where timeless materials meet a considered, lived-in calm.</p><p>From the first survey to post-handover care, one team owns design and construction. Restrained elegance meets everyday function. <em>(placeholder copy)</em></p>',
    bodyKo:
      '<p>스튜디오115는 주거와 상업 공간을 다루는 인테리어·건축 스튜디오입니다. 오래 견디는 재료와 절제된 디테일로, 시간이 지나도 편안한 공간을 만듭니다.</p><p>설계부터 시공, 사후관리까지 하나의 팀이 책임집니다. 절제된 완성도와 생활의 기능을 함께 봅니다. <em>(플레이스홀더 문구)</em></p>',
  },
  {
    slug: 'terms',
    titleKo: '이용약관',
    titleEn: 'Terms of Use',
    bodyEn:
      '<p>These terms govern the use of the website operated by Studio115 ("the Company"). Information provided here is for reference only and may not be reproduced, redistributed or used commercially without the Company\'s prior consent. Matters not specified here follow applicable law and common practice. <em>(Placeholder — replace with the final terms.)</em></p>',
    bodyKo:
      '<p>본 약관은 스튜디오115(이하 \'회사\')가 운영하는 웹사이트의 이용 조건과 절차, 이용자와 회사의 권리·의무를 규정합니다. 이용자는 본 사이트의 정보를 참고 목적으로 이용할 수 있으며, 회사의 사전 동의 없이 콘텐츠를 복제·배포·상업적으로 이용할 수 없습니다. 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다. <em>(플레이스홀더 — 실제 약관으로 교체)</em></p>',
  },
  {
    slug: 'privacy',
    titleKo: '개인정보처리방침',
    titleEn: 'Privacy Policy',
    bodyEn:
      '<p>Studio115 ("the Company") establishes this privacy policy under Article 30 of the Personal Information Protection Act. The Company collects your name, contact details, email and project information to handle consultation requests, and does not use it for any other purpose. Personal data is destroyed without delay once its purpose is fulfilled. <em>(Placeholder — replace with the final policy.)</em></p>',
    bodyKo:
      '<p>스튜디오115(이하 \'회사\')는 개인정보 보호법 제30조에 따라 개인정보 처리방침을 수립·공개합니다. 회사는 상담·문의 처리를 위해 성함, 연락처, 이메일, 프로젝트 관련 정보를 수집하며, 그 외의 용도로 이용하지 않습니다. 개인정보는 목적 달성 후 지체 없이 파기하며, 정보주체는 열람·정정·삭제·처리정지를 요구할 수 있습니다. <em>(플레이스홀더 — 실제 방침으로 교체)</em></p>',
  },
];

async function seedPages() {
  for (const p of PAGES) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`  pages: ${PAGES.length}`);
}

type SeedProject = {
  slug: string;
  categorySlug: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
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
  { slug: 'villa-travertine', categorySlug: 'residential', titleKo: '빌라 트래버틴', titleEn: 'VILLA TRAVERTINE', summaryKo: '트래버틴과 오크로 마감한 전용 82평 빌라.', summaryEn: 'A 271㎡ villa finished in travertine and oak.', type: 'Residence', location: 'Cheongdam-dong, Seoul', sizeLabel: '271 m²', areaSqm: 271, involvement: 'Design, Construction', completionDate: '08.2024', photography: 'Donggyu Kim', year: 2024, featured: true, shots: 5 },
  { slug: 'grid-seongsu', categorySlug: 'commercial', titleKo: '그리드 성수', titleEn: 'GRID SEONGSU', summaryKo: '노출 콘크리트 골조를 살린 성수동 편집숍 겸 카페.', summaryEn: 'A Seongsu concept store and cafe with an exposed concrete frame.', type: 'Retail, Cafe', location: 'Seongsu-dong, Seoul', sizeLabel: '164 m²', areaSqm: 164, involvement: 'Design, Construction', completionDate: '03.2024', photography: 'Donggyu Kim', year: 2024, featured: true, shots: 4 },
  { slug: 'miwoococo-house', categorySlug: 'residential', titleKo: '미우코코 하우스', titleEn: 'MIWOOCOCO HOUSE', summaryKo: '두 세대가 함께 사는 협소주택.', summaryEn: 'A narrow two-family house organised around its stair core.', type: 'Residence', location: 'Yeonhui-dong, Seoul', sizeLabel: '138 m²', areaSqm: 138, involvement: 'Design', completionDate: '11.2023', photography: 'Sunghwan Yoon', year: 2023, featured: true, shots: 4 },
  { slug: 'tower-palace', categorySlug: 'residential', titleKo: '타워팰리스', titleEn: 'TOWER PALACE', summaryKo: '고층 아파트 전면 리노베이션.', summaryEn: 'A full high-rise apartment renovation.', type: 'Residence', location: 'Dogok-dong, Seoul', sizeLabel: '198 m²', areaSqm: 198, involvement: 'Design, Construction', completionDate: '06.2023', photography: 'Donggyu Kim', year: 2023, featured: false, shots: 3 },
  { slug: '109hannam', categorySlug: 'residential', titleKo: '109 한남', titleEn: '109HANNAM', summaryKo: '한강이 보이는 펜트하우스.', summaryEn: 'A river-facing penthouse.', type: 'Residence', location: 'Hannam-dong, Seoul', sizeLabel: '258 m²', areaSqm: 258, involvement: 'Design, Construction', completionDate: '12.2022', photography: 'Donggyu Kim', year: 2022, featured: false, shots: 4 },
  { slug: 'yangpyeong-house', categorySlug: 'residential', titleKo: '양평 주택', titleEn: 'YANGPYEONG HOUSE', summaryKo: '전원 단독주택. 편백과 제주석을 주재료로.', summaryEn: 'A countryside house built mainly with hinoki and basalt.', type: 'Residence', location: 'Yangpyeong-gun, Gyeonggi', sizeLabel: '112 m²', areaSqm: 112, involvement: 'Design, Construction', completionDate: '05.2022', photography: 'Sunghwan Yoon', year: 2022, featured: false, shots: 3 },
  { slug: 'cheongdam-c-villa', categorySlug: 'residential', titleKo: '청담 C.빌라', titleEn: 'CHEONGDAM C.VILLA', summaryKo: '복층 빌라. 아치 개구부로 두 층의 시선을 연결.', summaryEn: 'A duplex villa linked by arched openings.', type: 'Residence', location: 'Cheongdam-dong, Seoul', sizeLabel: '221 m²', areaSqm: 221, involvement: 'Design', completionDate: '09.2021', photography: 'Donggyu Kim', year: 2021, featured: false, shots: 3 },
];

async function seedProjects() {
  const cats = await prisma.category.findMany();
  const catId = (slug: string) => cats.find((c) => c.slug === slug)?.id;

  for (let p = 0; p < PROJECTS.length; p++) {
    const proj = PROJECTS[p];
    const categoryId = catId(proj.categorySlug);
    if (!categoryId) throw new Error(`missing category ${proj.categorySlug}`);

    const media = Array.from({ length: proj.shots }, (_, i) => ({
      type: 'IMAGE',
      url: img(`${proj.slug}-${i + 1}`),
      alt: `${proj.titleEn} — ${i + 1}`,
      order: i,
    }));

    const base = {
      titleKo: proj.titleKo,
      titleEn: proj.titleEn,
      summaryKo: proj.summaryKo,
      summaryEn: proj.summaryEn,
      descriptionKo: `<p>${proj.summaryKo}</p><p><em>(상세 설명 플레이스홀더 — 프로젝트 배경, 자재, 공정, 결과를 여기에 작성합니다.)</em></p>`,
      descriptionEn: `<p>${proj.summaryEn}</p><p><em>(Placeholder body — write the brief, materials, process and outcome here.)</em></p>`,
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
      categoryId,
    };

    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: { ...base, media: { deleteMany: {}, create: media } },
      create: { slug: proj.slug, ...base, media: { create: media } },
    });
  }
  console.log(`  projects: ${PROJECTS.length}`);
}

const SERVICES = [
  { slug: 'residential-design', titleKo: '주거 디자인', titleEn: 'Residential Design', descriptionKo: '아파트, 단독주택, 빌라의 전체 리노베이션과 부분 리모델링.', descriptionEn: 'Full and partial renovations for apartments, houses and villas.', icon: 'home' },
  { slug: 'commercial-design', titleKo: '상업 디자인', titleEn: 'Commercial Design', descriptionKo: '카페, 리테일, 오피스 등 브랜드 경험을 담은 상업 공간 설계.', descriptionEn: 'Cafes, retail and offices designed around the brand experience.', icon: 'store' },
  { slug: 'architecture', titleKo: '건축', titleEn: 'Architecture', descriptionKo: '신축·대수선 설계와 인허가, 감리.', descriptionEn: 'New-build and major-renovation design, permits and supervision.', icon: 'ruler' },
  { slug: 'furniture-design', titleKo: '가구 디자인', titleEn: 'Furniture Design', descriptionKo: '공간에 맞춘 제작 가구와 FF&E 큐레이션.', descriptionEn: 'Bespoke built-in furniture and FF&E curation.', icon: 'sofa' },
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
  if ((await prisma.inquiry.count()) > 0) {
    console.log('  inquiries: skipped (already present)');
    return;
  }
  await prisma.inquiry.create({
    data: {
      name: '김서연',
      phone: '010-1234-5678',
      email: 'seoyeon@example.com',
      industry: '카페',
      businessName: '(예비) 그레이 로스터스',
      region: '서울 성동구 성수동',
      addressDetail: '연무장길 00',
      scopes: 'CONSTRUCTION,DESIGN',
      contractStatus: 'IN_PROGRESS',
      message:
        '1층 상가, 전용 18평. 실측 가능하고 공사예정일은 다음 달, 오픈은 3개월 뒤 목표입니다.',
      budgetText: '8천만원 내외',
      attachmentsJson: '[]',
      status: 'NEW',
    },
  });
  console.log('  inquiries: 1 sample row');
}

async function main() {
  console.log('Seeding Studio115 (SQL Server)…');
  await seedAdmin();
  await seedCategories();
  await seedSettings();
  await seedPages();
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
