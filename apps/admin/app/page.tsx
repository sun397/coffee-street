"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@repo/ui/components/atom/button";
import { Card, CardContent } from "@repo/ui/components/atom/card";

export default function AdminDashboard() {
  const { user, logout, shop } = useAuthStore();
  const router = useRouter();

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{shop?.name ?? "Coffee Street Admin"}</h1>
          <p className="text-sm text-gray-500">{(user?.identities?.map(({identity_data}) => identity_data?.name + identity_data?.email))} としてログイン中</p>
        </div>

        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          ログアウト
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-dashed">
          <CardContent className="text-center text-gray-400 pt-6">
            豆の登録（準備中）
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardContent className="text-center text-gray-400 pt-6">
            在庫管理（準備中）
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
