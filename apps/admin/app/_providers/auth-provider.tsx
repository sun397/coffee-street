"use client";

import { useEffect, useMemo } from "react";
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

  const isPublic = useMemo(() =>
    PUBLIC_PATHS.some(path => pathname.startsWith(path)),
    [pathname]);

  const redirectTo = useMemo(() => {
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

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (loading || (user && shopLoading) || redirectTo) {
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