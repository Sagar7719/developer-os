# ==========================================
# DEVELOPER OS - CLIENT MULTI-STAGE DOCKERFILE
# Stage 1: Build production static distribution
# Stage 2: Serve static files via Nginx
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace configurations
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/client ./apps/client
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

# Build production client assets
RUN pnpm --filter @developer-os/client run build

# Stage 2: Production Nginx Static Web Server
FROM nginx:alpine AS runtime

COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
