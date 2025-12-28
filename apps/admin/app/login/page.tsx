"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("ログイン失敗:", error);
      alert("ログインに失敗しました。");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">読み込み中...</div>;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Coffee Street Admin</h1>
        <p className="text-sm text-gray-600 mb-8">店舗管理画面へログイン</p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          Googleでログイン
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
          ※関係者以外の方はアクセスできません
        </p>
      </div>
    </div>
  );
}
