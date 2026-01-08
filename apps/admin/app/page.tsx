"use client";

import { useAuthStore } from "@repo/store";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useShop } from "@/hooks/use-shop";

export default function AdminDashboard() {
  // セレクタ形式。これだけで、loadingが変わった時だけ再レンダリングされるようになります。
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const { shopQuery } = useShop();

  const handleLogout = async () => {
    await signOut(auth);
    // ログアウトも同様。AuthInitializerが検知してストアを null にしてくれます。
  };

  if (loading) return <div>読み込み中...</div>;
  if (!user) return null;
  if (shopQuery.isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.email} さん</h1>
      <h1>{shopQuery.data?.name}</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}
