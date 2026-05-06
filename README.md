# Coffee Street (コーヒーストリート)

コーヒーロースター・カフェ向けの在庫管理・販売支援プラットフォーム。
店舗の「こだわり」をデジタル化し、取り置き予約を通じてファンと店舗を繋ぎます。

## サービス構成

このリポジトリは Turborepo を使用したモノレポ構成です。

- **apps/admin (Admin)**: 店舗向け管理画面。豆の登録、在庫管理、予約管理、設定。
- **apps/user (User)**: 一般ユーザー向け。店舗情報の閲覧、豆のストーリー確認、取り置き予約。
- **packages/ui**: Admin/User 両方で共有するUIコンポーネントライブラリ。
- **packages/typescript-config**: 共通のTS設定。

## 技術スタック

- **Frontend**: Next.js (App Router), TypeScript
- **BaaS**: Supabase (Auth, Database, RLS, Storage)
- **State**: Zustand, TanStack Query
- **UI**: Tailwind CSS, shadcn/ui

## 開発環境のセットアップ

### 前提条件
- Node.js (v18+)
- pnpm (v8+)

### 初回セットアップ
```sh
# 依存関係のインストール
pnpm install

# 環境変数の設定 (apps/admin/.env.local 等を作成)
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 開発サーバーの起動

```sh
# 管理画面 (Admin) の起動
pnpm --filter admin run dev

# ユーザー画面 (User) の起動
pnpm --filter user run dev
```

## UIコンポーネントの追加手順

共有パッケージである `packages/ui` に新しい shadcn/ui コンポーネントを追加する場合は、以下の手順で行います。

```powershell
# UIパッケージのディレクトリへ移動
cd packages/ui

# shadcn/ui でコンポーネントを追加
pnpm dlx shadcn@latest add "コンポーネント名"
```

> [!TIP]
> **エクスポートの確認**
> 追加したコンポーネントを各アプリから利用できるようにするため、`packages/ui/src/index.ts`（または各ディレクトリの index.ts）で `export` されていることを確認してください。

## セキュリティ (RLS)

バックエンドを介さずクライアントから直接 Supabase を操作するため、セキュリティは **Row Level Security (RLS)** によって保護されています。データベース操作を行う際は、必ずポリシーが適切に設定されているかを確認してください。

---