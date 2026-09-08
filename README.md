# Studio115

Website, backend and admin for **Studio115**, an interior design company.

- **`apps/web`** — public marketing site. Next.js 15 (App Router) · Tailwind · `next-intl` (ko / en). Deploys to **Vercel**.
- **`apps/admin`** — staff admin panel. Next.js 15 · Tailwind · SWR. Deploys to **Vercel**.
- **`apps/api`** — REST backend. NestJS 11 · Prisma · **Microsoft SQL Server** · JWT. Deploys to **Railway**.
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

Seeded admin login: **admin** / **bboyong**

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

## Images / photo storage — Cloudflare R2

The API has a provider-agnostic storage layer (`apps/api/src/storage`).

- **dev** — `STORAGE_DRIVER=local`, files in `apps/api/uploads/`, served at `/uploads/*`.
- **prod** — `STORAGE_DRIVER=s3` against **Cloudflare R2**:
  - Bucket `studio1151`, account `c8c11b6f0653e467b146a45f884752ab`
  - Endpoint `https://c8c11b6f0653e467b146a45f884752ab.r2.cloudflarestorage.com`
  - Credentials: create an **R2 API token** (Cloudflare dashboard → R2 → *Manage
    API Tokens* → *Create* → **Object Read & Write**, scoped to `studio1151`) →
    put the Access Key ID / Secret into `STORAGE_S3_*` on Railway.
  - Public reads: attach a **custom domain** to the bucket (e.g.
    `img.studioiio.com`) or enable its `pub-xxxx.r2.dev` URL →
    `STORAGE_PUBLIC_BASE_URL` (API) and `NEXT_PUBLIC_IMAGE_CDN` (web).
  - **CORS**: the bucket CORS `AllowedOrigins` must include the **admin** origin
    (`https://<admin-domain>`, `http://localhost:3001`) — that's what does the
    presigned browser PUT. The public site origin does not upload.

Admin/contact uploads: admin uses **presigned PUT** (browser → R2 directly);
the public contact form posts to `POST /api/inquiries/attachments` (server-side
put, image/pdf only). The AWS SDK's flexible checksums are disabled in the S3
client because R2 rejects them.

The web app's **custom `next/image` loader** serves images from R2 instead of
Vercel's quota. `NEXT_PUBLIC_IMAGE_CDN_MODE=cloudflare` uses
`/cdn-cgi/image/...` transforms (enable **Transformations** on the Cloudflare
zone first); `query` / `passthrough` are fallbacks.

---

## Deployment

```
web    → Vercel   · Root Directory: apps/web
admin  → Vercel   · Root Directory: apps/admin
api    → Railway  · Root Directory: /  (repo root)   ~$5/mo
db     → self-hosted PostgreSQL (개인 서버)
```

### Database → Microsoft SQL Server (shared host)
`DATABASE_URL` (Prisma `sqlserver://` form) points at the MSSQL host — **not** a
Railway plugin. Notes:
- Prisma has no enum / scalar-list support on SQL Server, so enum-like values are
  strings and `scopes` / `attachments` are stored serialized.
- Shared hosting has no shadow DB, so the schema is applied with **`prisma db
  push`**, not migrations. The API container runs `prisma db push` on every boot
  (without `--accept-data-loss`, so a destructive drift fails the deploy loudly).
- Tables & columns are **PascalCase**.

Apply schema + seed once:
```bash
DATABASE_URL="sqlserver://…" pnpm db:push
DATABASE_URL="sqlserver://…" pnpm db:seed
```

### API → Railway
1. New project → **Deploy from GitHub repo** → this repo.
2. Settings → **Root Directory** = `/` (the Docker build needs `packages/shared`).
   `railway.json` points the build at `apps/api/Dockerfile`.
3. Variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (the Vercel web + admin
   URLs), `API_PUBLIC_URL`, and the `STORAGE_*` block (`STORAGE_DRIVER=s3` + R2).

### web / admin → Vercel (one project each, same repo)
1. Import the repo twice.
2. **Root Directory**: `apps/web` for one project, `apps/admin` for the other.
   `vercel.json` in each sets the monorepo install/build commands.
3. Environment variables:
   - web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_IMAGE_CDN`,
     `NEXT_PUBLIC_IMAGE_CDN_MODE`
   - admin: `NEXT_PUBLIC_API_URL`
4. After both are live, put their URLs in the API's `CORS_ORIGINS` and redeploy the API.

---

## Notes / TODO

- Admin auth stores the JWT in `localStorage` (MVP). Harden to an httpOnly
  cookie + refresh tokens before launch.
- Add `sitemap.ts` / `robots.ts` to `apps/web`.
- Replace picsum placeholder images with real photography.
- Wire real company copy through the admin **사이트 설정** (SiteSetting) screen.
