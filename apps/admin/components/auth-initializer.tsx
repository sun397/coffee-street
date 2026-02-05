"use client";

import { useEffect } from "react";
import { initializeAuthListener, cleanupAuthListener } from "@/lib/stores/auth-store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuthListener();
    return () => cleanupAuthListener();
  }, []);

  return <>{children}</>;
}
