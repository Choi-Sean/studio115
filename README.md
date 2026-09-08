# Studio115

Website, backend and admin for **Studio115**, an interior design company.

- **`apps/web`** — public marketing site. Next.js 15 (App Router) · Tailwind · `next-intl` (ko / en). Deploys to **Vercel**.
- **`apps/admin`** — staff admin panel. Next.js 15 · Tailwind · SWR. Deploys to **Vercel**.
- **`apps/api`** — REST backend. NestJS 11 · Prisma · PostgreSQL · JWT. Deploys to **Railway**.
- **`packages/shared`** — TypeScript types + enums shared by all three.

Monorepo: **pnpm workspaces + Turborepo**.

```
studio115/
├── apps/
│   ├── web/      → studio115.kr        (Vercel · root dir: apps/web)
│   ├── admin/    → admin.studio115.kr  (Vercel · root dir: apps/admin)
│   └── api/      → api.studio115.kr    (Railway · root dir: repo root)
└── packages/
    └── shared/
```

---

## Local development

### Prerequisites
- Node 20+ (repo pins 22 via `.nvmrc`)
- pnpm 9 — `npm install -g pnpm`
- A PostgreSQL database. Either:
  - `docker compose up -d db` (uses `docker-compose.yml`), or
  - a free Railway Postgres — copy its connection string.

### Setup

```bash
pnpm install

# API env
cp apps/api/.env.example apps/api/.env
#   → set DATABASE_URL, JWT_SECRET

pnpm --filter @studio115/shared build     # build shared types once
pnpm db:migrate                            # create tables
pnpm db:seed                               # admin user + placeholder content

# Web / admin env (defaults already point at localhost:4000)
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

### Run

```bash
pnpm dev
```

| App   | URL                      |
|-------|--------------------------|
| web   | http://localhost:3000    |
| admin | http://localhost:3001    |
| api   | http://localhost:4000/api  (Swagger: `/api/docs`) |

Seeded admin login: **admin@studio115.kr** / **studio115!admin**

> The web app ships fallback placeholder data, so it renders even if the API/DB
> isn't up yet. The admin app needs the API running.

---

## Scripts (run from repo root)

| Command | Does |
|---|---|
| `pnpm dev` | all three apps in watch mode |
| `pnpm build` | build everything (Turbo) |
| `pnpm typecheck` / `pnpm lint` | across the workspace |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:seed` | seed admin + demo content |
| `pnpm db:studio` | Prisma Studio |

---

## Images / photo storage

Interior work is photo-heavy. The API has a provider-agnostic storage layer
(`apps/api/src/storage`):

- **dev** — `STORAGE_DRIVER=local`, files saved to `apps/api/uploads/`, served at `/uploads/*`.
- **prod** — `STORAGE_DRIVER=s3`, works with any S3-compatible store:
  **Cloudflare R2** (recommended — zero egress), NCP / NHN Cloud Object Storage
  (Korean billing), AWS S3, Wasabi, Backblaze B2.

Admin uploads use **presigned PUT** — the browser uploads straight to storage,
bytes never pass through Railway.

The web app uses a **custom `next/image` loader** (`apps/web/src/lib/image-loader.ts`)
so resizing happens at the image CDN, not on Vercel's quota. Set
`NEXT_PUBLIC_IMAGE_CDN` to enable it.

---

## Deployment

### API → Railway
1. New project → **Deploy from GitHub repo** → this repo.
2. Add a **PostgreSQL** plugin. Railway sets `DATABASE_URL`.
3. Service settings:
   - Root directory: **`/`** (repo root — the Docker build needs `packages/shared`).
   - Build: Dockerfile (`railway.json` points at `apps/api/Dockerfile`).
4. Variables: `JWT_SECRET`, `CORS_ORIGINS` (the web + admin URLs),
   `API_PUBLIC_URL`, storage vars.
5. The container runs `prisma migrate deploy` on boot. Seed once from your
   machine against the prod URL if needed: `DATABASE_URL=... pnpm db:seed`.

### web / admin → Vercel (one project each)
1. New Project → import repo.
2. **Root Directory**: `apps/web` (and a second project for `apps/admin`).
3. `vercel.json` in each app sets the install/build commands for the monorepo.
4. Environment variables:
   - web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_IMAGE_CDN`
   - admin: `NEXT_PUBLIC_API_URL`
5. After both are live, add their URLs to the API's `CORS_ORIGINS`.

---

## Notes / TODO

- Admin auth stores the JWT in `localStorage` (MVP). Harden to an httpOnly
  cookie + refresh tokens before launch.
- Add `sitemap.ts` / `robots.ts` to `apps/web`.
- Replace picsum placeholder images with real photography.
- Wire real company copy through the admin **사이트 설정** (SiteSetting) screen.
