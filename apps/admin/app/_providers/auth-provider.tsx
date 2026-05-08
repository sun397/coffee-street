"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useAuthStore,
  initializeAuthListener,
  cleanupAuthListener
} from "@/lib/stores/auth-store";

const PUBLIC_PATHS = ["/login", "/register"] as const;

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasShop, shopLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // 初回ロードが完了したかどうかを管理
  const [isInitialized, setIsInitialized] = useState(false);

  const isPublic = useMemo(() =>
    PUBLIC_PATHS.some(path => pathname.startsWith(path)),
    [pathname]);

  const redirectTo = useMemo(() => {
    // 認証情報の初期ロード中はリダイレクト判定を保留
    if (loading) return null;

    if (!user) {
      return isPublic ? null : "/login";
    }

    if (!shopLoading) {
      if (!hasShop && pathname !== "/register") {
        return "/register";
      }
      if (hasShop && isPublic) {
        return "/";
      }
    }

    return null;
  }, [user, loading, hasShop, shopLoading, isPublic, pathname]);

  // 初回初期化完了の検知
  useEffect(() => {
    if (!loading && (!user || !shopLoading)) {
      setIsInitialized(true);
    }
  }, [loading, user, shopLoading]);

  // リダイレクト処理
  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  // --- 表示制御のロジック ---

  // 1. リダイレクトが必要な場合は、遷移を優先（何も出さない、あるいはローディング）
  if (redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );
  }

  // 2. 初回ロード中のみ全画面ローディングを出す
  // 一度 initialized になれば、背後で多少の状態変化があっても children を出し続ける
  if (!isInitialized && (loading || (user && shopLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuthListener();
    return () => cleanupAuthListener();
  }, []);

  return <AuthGuard>{children}</AuthGuard>;
}