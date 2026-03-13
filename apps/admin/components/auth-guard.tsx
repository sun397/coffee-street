"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasShop, shopLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  // リダイレクト先をレンダー中に同期計算する
  let redirectTo: string | null = null;
  if (!loading) {
    if (!user && !isPublic) {
      redirectTo = "/login";
    } else if (user && !shopLoading) {
      if (!hasShop && pathname !== "/register") {
        redirectTo = "/register";
      } else if (hasShop && isPublic) {
        redirectTo = "/";
      }
    }
  }

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  // 認証状態解決待ち、またはリダイレクト待ちの間はchildrenを見せない
  if (loading || (user && shopLoading) || redirectTo) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">読み込み中...</div>;
  }

  return <>{children}</>;
}
