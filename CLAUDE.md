# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development (runs all apps in parallel)
pnpm dev

# Build all apps and packages
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format code
pnpm format

# Run single app
pnpm --filter admin dev    # Admin app on port 3000
pnpm --filter user dev     # User app on port 3001
pnpm --filter api dev      # Go API on port 8080 (uses Air for hot reload)

# Generate new UI component in packages/ui
pnpm --filter @repo/ui generate:component
```

## Architecture

This is a Turborepo monorepo with pnpm workspaces.

### Apps

- **apps/admin**: Next.js 16 admin dashboard (port 3000). Uses Firebase Authentication for login.
- **apps/user**: Next.js 16 user-facing app (port 3001).
- **apps/api**: Go backend using Echo framework (port 8080). Authenticates via Firebase Admin SDK with JWT tokens.

### Packages

- **packages/ui** (`@repo/ui`): Shared React component library using shadcn/ui pattern with Radix UI primitives and Tailwind CSS v4. Components are organized in `src/components/atom/`. Import via `@repo/ui` or `@repo/ui/components/*`.
- **packages/eslint-config** (`@repo/eslint-config`): Shared ESLint configurations. Exports `base`, `next-js`, and `react-internal`.
- **packages/typescript-config** (`@repo/typescript-config`): Shared TypeScript configurations.

### Key Patterns

- UI components use `cn()` utility from `@repo/ui/lib/utils` for Tailwind class merging
- Apps import shared components from `@repo/ui`
- Go API expects `service-account.json` for Firebase authentication
- ESLint uses `--max-warnings 0` to treat warnings as errors
