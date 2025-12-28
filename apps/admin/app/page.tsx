"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth(); // logout を追加
  const router = useRouter();
  const [message, setMessage] = useState("API呼び出し中...");
  const [userId, setUserId] = useState("");

  // 1. 認証ガード: ログインしていない場合はログイン画面へ
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 2. API疎通テスト
  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:8080/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMessage(data.message);
          setUserId(data.user_id);
        } else {
          setMessage("認証エラーが発生しました");
        }
      } catch (err) {
        console.error(err);
        setMessage("API接続に失敗しました");
      }
    };

    if (!loading && user) {
      fetchPrivateData();
    }
  }, [user, loading]);

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!user) return null;

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coffee Street Admin</h1>
          <p className="text-sm text-gray-500">{user.displayName} としてログイン中</p>
        </div>
        
        {/* ログアウトボタン */}
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
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 text-gray-700">バックエンドからの応答:</h2>
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-bold">{message}</p>
          {userId && (
            <p className="mt-2 text-xs text-green-600">
              User ID: <span className="font-mono bg-white px-1">{userId}</span>
            </p>
          )}
        </div>
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
