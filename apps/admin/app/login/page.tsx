"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@repo/store";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading } = useAuthStore();
  const router = useRouter();

  // 既にログインしている場合はトップへ飛ばす
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 成功時、AuthInitializerが検知してストアが更新されるため、
      // ここで手動リダイレクトしなくてもuseEffect側で処理されます
    } catch (err: any) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
      setIsSubmitting(false);
    }
  };

  // 認証状態のロード中は真っ白を避けるため簡易ローディングを表示
  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (user) return null; // useEffectのリダイレクトを待つ

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center text-black">Admin Login</h1>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 text-white rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
