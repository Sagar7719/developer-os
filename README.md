# Developer OS (v1.0)

**Brand**: Sagar.dev | **Product**: Developer OS

Production-grade Monorepo workspace built with React 19, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas. Inspired by the engineering and design standards of Apple, Stripe, and Vercel.

---

## Workspace Quickstart

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 8.0.0` (`npm install -g pnpm`)

### Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

3. **Run Local Development Servers**
   ```bash
   pnpm dev
   ```

---

## Monorepo Architecture Overview

```
developer-os/
├── apps/
│   ├── client/     # React 19 + Vite + Tailwind CSS + TanStack Query Application
│   └── server/     # Node.js + Express + Mongoose + JWT Backend Service
├── packages/
│   ├── shared/     # Shared Types, Schemas, Utils & Constants
│   └── ui/         # Design System Primitives & UI Component Library
├── configs/        # Monorepo build and lint presets
├── docs/           # System Architecture & API Documentation
└── assets/         # Design Assets & Logos
```

---

## Scripts Reference

- `pnpm dev`: Runs both `client` and `server` concurrently.
- `pnpm build`: Compiles all workspace packages and apps.
- `pnpm lint`: Runs ESLint code quality checks across the entire monorepo.
- `pnpm format`: Runs Prettier formatter across all source files.

---

## Security & Environment

All sensitive configuration parameters are isolated in environment variables. Ensure `.env` is never committed to source control.
