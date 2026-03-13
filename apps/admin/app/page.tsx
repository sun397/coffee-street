"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function AdminDashboard() {
  const { user, loading, logout, hasShop, shopLoading, shop } = useAuthStore();
  const router = useRouter();

  // 認証ガード: ログインしていない場合はログイン画面へ
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ショップ未登録の場合は登録画面へ
  useEffect(() => {
    if (!loading && !shopLoading && user && !hasShop) {
      router.push("/register");
    }
  }, [user, loading, hasShop, shopLoading, router]);

  if (loading || shopLoading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!user || !hasShop) return null;

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{shop?.name ?? "Coffee Street Admin"}</h1>
          <p className="text-sm text-gray-500">{(user.identities?.map(({identity_data}) => identity_data?.name + identity_data?.email))} としてログイン中</p>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="bg-white border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          ログアウト
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-400">
          豆の登録（準備中）
        </div>
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-400">
          在庫管理（準備中）
        </div>
      </div>
    </div>
  );
}
