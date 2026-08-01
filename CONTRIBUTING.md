# Contributing to Developer OS (Sagar.dev)

Thank you for contributing to **Developer OS**. To maintain production-grade quality, please adhere to these standards:

---

## Code Standards & Conventions

1. **pnpm Usage**: Always use `pnpm` for package installation and workspace script execution.
2. **Architecture Scoping**:
   - Business logic must strictly reside in `server/src/services` (Server) or `client/src/features` (Client).
   - Shared models/schemas/types must be placed in `packages/shared`.
3. **Commit Messages**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
4. **Linting & Formatting**: Ensure `pnpm run lint` and `pnpm run format` pass cleanly before submitting PRs.

---

## Pull Request Process

1. Create a feature branch from `main`: `git checkout -b feature/short-description`.
2. Open a Pull Request referencing the related issue ID.
3. Ensure automated checks pass successfully.
