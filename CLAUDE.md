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

# Generate new UI component in packages/ui
pnpm --filter @repo/ui generate:component
```

## Architecture

This is a Turborepo monorepo with pnpm workspaces.

### Apps

- **apps/admin**: Next.js 16 admin dashboard (port 3000). Uses Firebase Authentication for login.
- **apps/user**: Next.js 16 user-facing app (port 3001).

### Packages

- **packages/ui** (`@repo/ui`): Shared React component library using shadcn/ui pattern with Radix UI primitives and Tailwind CSS v4. Components are organized in `src/components/atom/`. Import via `@repo/ui` or `@repo/ui/components/*`.
- **packages/eslint-config** (`@repo/eslint-config`): Shared ESLint configurations. Exports `base`, `next-js`, and `react-internal`.
- **packages/typescript-config** (`@repo/typescript-config`): Shared TypeScript configurations.

### State Management

Each app has its own state management in `lib/`:

- **TanStack Query**: サーバー状態（Firestoreデータ取得・キャッシュ）。`lib/queries/`にhooksを配置
- **Zustand**: クライアント状態（UI状態など）。`lib/stores/`にstoreを配置
- **Providers**: `lib/providers.tsx`でQueryClientProviderを設定

```
apps/admin/lib/
  firebase.ts     # Firebase初期化 (auth, db)
  providers.tsx   # TanStack Query Provider
  stores/         # Zustand stores
  queries/        # TanStack Query hooks
```

### Key Patterns

- UI components use `cn()` utility from `@repo/ui/lib/utils` for Tailwind class merging
- Apps import shared components from `@repo/ui`
- Query hooks use `queryKeys` object for cache key management
- ESLint uses `--max-warnings 0` to treat warnings as errors

### shadcn/ui コンポーネント利用ルール

- **ネイティブHTML要素は使用禁止**: `<button>`, `<input>`, `<label>` などの素のHTML要素は使わず、必ずshadcnコンポーネントを使用する
- **利用可能なコンポーネント**: `packages/ui/src/components/atom/` に配置。Button, Input, Label, Card, Badge, Avatar, Table, Dialog, Select, Checkbox, Form, Separator など22種類
- **インポートパス**: `@repo/ui/components/atom/[component]` または `@repo/ui`（ルートexport）を使用
  ```ts
  import { Button } from "@repo/ui/components/atom/button";
  import { Button, Card, Input } from "@repo/ui";
  ```
- **variantの活用**: ボタンは `variant="outline"` / `variant="destructive"` などを活用し、不要なスタイルの上書きを最小化する
- **カード/コンテナ**: レイアウトの囲みには `<Card>` / `<CardContent>` / `<CardHeader>` 等を使用する
