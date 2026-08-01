# Developer OS - Architectural Blueprint (v1.0)

**Brand**: Sagar.dev | **Product Name**: Developer OS

---

## 1. High-Level System Architecture

Developer OS is engineered as a production-grade full-stack system utilizing a **pnpm monorepo** workspace layout. The architecture decouples client-side user experience from core API micro-services while sharing strict cross-boundary TypeScript contracts and utilities.

```
                  ┌──────────────────────────────┐
                  │    React 19 Client App       │
                  │   (apps/client + Vite)       │
                  └──────────────┬───────────────┘
                                 │
                     HTTP / REST API (Axios)
                                 │
                  ┌──────────────▼───────────────┐
                  │   Express API Service Layer  │
                  │        (apps/server)         │
                  └──────────────┬───────────────┘
                                 │
                     Mongoose ORM Layer
                                 │
                  ┌──────────────▼───────────────┐
                  │    MongoDB Atlas Cluster     │
                  └──────────────────────────────┘
```

---

## 2. Server Architecture Pattern

The backend follows a strict 5-tier layered architecture to guarantee isolation of concerns, testability, and scalability:

`Routes` ──► `Controllers` ──► `Services` ──► `Repositories` ──► `Models`

1. **Routes (`src/routes`)**: API path mapping and HTTP verb routing.
2. **Controllers (`src/controllers`)**: HTTP Request parsing, status code handling, and response serialization.
3. **Services (`src/services`)**: Core business logic and workflow orchestration.
4. **Repositories (`src/repositories`)**: Data access abstractions separating database technology from business logic.
5. **Models (`src/models`)**: Mongoose schema definitions and index constraints.

---

## 3. Client Architecture Pattern

The frontend follows **Feature-Based Architecture**:

- `src/features/`: Encapuslated business domains (e.g. `hero`, `projects`, `experience`, `blog`, `admin`).
- `src/components/`: Reusable, domain-agnostic UI primitives.
- `src/api/`: Axios interceptor setups and baseline fetchers.
- `src/providers/`: Context and state provider compositions (`ThemeProvider`, `QueryProvider`, `AuthProvider`).

---

## 4. Shared Boundaries

- **`packages/shared`**: Contains domain schemas, data validation rules, shared types, and formatting utility helpers consumed by both `client` and `server`.
- **`packages/ui`**: Consolidates design tokens, CSS variables, and base component primitives.
