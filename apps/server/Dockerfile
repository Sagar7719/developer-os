# ==========================================
# DEVELOPER OS - SERVER MULTI-STAGE DOCKERFILE
# Stage 1: Install workspace dependencies
# Stage 2: Minimal Node 22 unprivileged production runtime
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace configurations
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy server and shared package source
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared

# Stage 2: Minimal Production Runtime
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy built application and workspace dependencies from builder
COPY --from=builder /app ./

# Use unprivileged node user for security
USER node

EXPOSE 5000

CMD ["node", "apps/server/src/server.js"]
