FROM node:22-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN pnpm install
# Dummy POSTGRES_URL for build-time validation by @vercel/postgres and Drizzle
# This value is not used at runtime; the real POSTGRES_URL is provided via .env
ENV POSTGRES_URL="postgres://build:build@localhost:5432/build_placeholder"
# Dummy AWS region for S3/Blob SDK build-time validation
ENV AWS_REGION="us-east-1"
ENV BLOB_READ_WRITE_TOKEN="dummy_blob_token_for_build"
RUN turbo build --filter=studio.giselles.ai

FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app .
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["pnpm", "--filter", "studio.giselles.ai", "start"]
