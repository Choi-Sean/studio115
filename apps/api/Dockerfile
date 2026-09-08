# Studio115 API — build context MUST be the repo root (needs packages/shared).
# Railway: set root directory to the repo root and point at apps/api/Dockerfile.
# syntax=docker/dockerfile:1

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH"
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable
WORKDIR /repo

# ---- install (cached on manifests) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --filter @studio115/api... --filter @studio115/shared

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
