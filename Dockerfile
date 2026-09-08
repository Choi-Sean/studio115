# Studio115 API — lives at the repo root so the Docker build context is the
# whole monorepo (the API needs packages/shared + the workspace lockfile).
#
# Railway: leave the service's Root Directory EMPTY (= repo root). railway.json
# points the builder here.
# syntax=docker/dockerfile:1

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH"
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable
WORKDIR /repo

# ---- install ----
FROM base AS deps
# These four only exist at the monorepo root. If this COPY fails with
# "pnpm-lock.yaml: not found", the Railway service Root Directory is wrong —
# it must be EMPTY (repo root), not "apps/api".
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @studio115/api... --filter @studio115/shared

# ---- build ----
FROM deps AS build
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @studio115/shared build \
  && pnpm --filter @studio115/api exec prisma generate \
  && pnpm --filter @studio115/api build

# ---- runtime ----
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo /repo
WORKDIR /repo/apps/api
EXPOSE 4000
# Sync schema (db push — shared MSSQL host has no shadow DB for migrations), then start.
# No --accept-data-loss: a destructive schema drift fails the deploy loudly instead
# of dropping columns. Run `pnpm db:push` by hand when a destructive change is intended.
CMD ["sh", "-c", "node ../../node_modules/prisma/build/index.js db push --skip-generate && node dist/main.js"]
