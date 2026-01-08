"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@repo/store";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Firebaseの認証状態を監視し、Zustandの"Authテーブル"に同期
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
};
