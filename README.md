# Coffee Street (コーヒーストリート)

コーヒーロースター・カフェ向けの在庫管理・販売支援プラットフォーム。
店舗の「こだわり」をデジタル化し、取り置き予約を通じてファンと店舗を繋ぎます。

## サービス構成

このリポジトリは Turborepo を使用したモノレポ構成です。

- **apps/admin (Admin)**: 店舗向け管理画面。豆の登録、在庫管理、店頭POP生成、予約管理。
- **apps/user (User)**: 一般ユーザー向け。店舗情報の閲覧、豆のストーリー確認、取り置き予約。
- **apps/api (Go/Echo)**: 共通バックエンド。Firestoreとの通信、ビジネスロジック、画像生成等。
- **packages/ui**: Admin/User 両方で共有するUIコンポーネントライブラリ。
- **packages/typescript-config**: 共通のTS設定。

## 開発環境のセットアップ

### 前提条件
- Node.js (v18+) & pnpm
- Go (v1.21+)
- [Air](https://github.com/air-verse/air) (Goのホットリロード用)

### 初回セットアップ
```sh
# 依存関係のインストール
pnpm install

# Goの依存関係インストール
cd apps/api
go mod download