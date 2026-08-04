# Changelog

All notable changes to **Developer OS (Sagar.dev)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-08-04

### Added
- **Platform Settings CMS (RFC-007)**: Full 5-tier architecture (`Model`, `DTO`, `Validator`, `Repository`, `Service`, `Controller`, `Routes`) for global site settings singleton (`key: 'site_settings'`).
- **Admin Settings CMS Page (`SettingsAdmin.jsx`)**: 9-tab administration dashboard for General, Hero, About, Social, Contact, SEO, Footer, Maintenance, and System Info.
- **Dynamic Portfolio Bindings**: Real-time binding of `Hero`, `Navbar`, `Footer`, `Home`, `ContactPage`, and `PageMetadata` to cached settings (`usePublicSettings()`).
- **System Maintenance Guard Mode (`MaintenanceGuard.jsx`)**: Extensible global route guard protecting public pages when Maintenance Mode is enabled (`MAINTENANCE_BYPASS_ROUTES = ['/admin']`). Automated SEO overriding (`noindex, nofollow`) during maintenance lock cycles.
- **Final Release Documentation**: Published comprehensive release analysis in `docs/releases/RFC-007-FINAL-RELEASE-REPORT.md`.

---

## [1.0.0] - 2026-08-02

### Added
- **Monorepo Foundation (ESD-001)**: Initialized pnpm workspace structure (`apps/client`, `apps/server`, `packages/shared`, `packages/ui`).
- **Tooling & DX**: Configured ESLint, Prettier, EditorConfig, VS Code workspaces, and GitHub issue/PR templates.
- **Architectural Specs**: Published `ARCHITECTURE.md`, root `.env.example`, and structured `docs/` directories.
