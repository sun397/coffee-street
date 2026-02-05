"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Input } from "@repo/ui/components/atom/input";
import { Label } from "@repo/ui/components/atom/label";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, loginWithEmail } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      console.error("ログイン失敗:", error);
      setError("Googleログインに失敗しました。");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await loginWithEmail(email, password);
    } catch (error: unknown) {
      console.error("ログイン失敗:", error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/user-not-found") {
        setError("アカウントが見つかりません。");
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("パスワードが正しくありません。");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("メールアドレスの形式が正しくありません。");
      } else if (firebaseError.code === "auth/invalid-credential") {
        setError("メールアドレスまたはパスワードが正しくありません。");
      } else {
        setError("ログインに失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <div className="text-zinc-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* 左側: ブランドエリア */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 flex-col justify-between p-12">
        <div>
          {/* ロゴ */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Coffee Street</h1>
              <p className="text-xs text-zinc-500 tracking-wider">MANAGEMENT CONSOLE</p>
            </div>
          </div>
        </div>

        {/* キャッチコピー */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            あなたの焙煎を、
            <br />
            もっと多くの人へ。
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Coffee Streetは、こだわりの自家焙煎コーヒーを
            <br />
            お客様に届けるためのプラットフォームです。
          </p>
        </div>

        <p className="text-xs text-zinc-600">
          © 2026 Coffee Street. All rights reserved.
        </p>
      </div>

      {/* 右側: ログインフォーム */}
      <div className="flex-1 flex items-center justify-center bg-zinc-50 p-8">
        <div className="w-full max-w-md">
          {/* モバイル用ロゴ */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-800">Coffee Street</h1>
              <p className="text-xs text-zinc-500 tracking-wider">MANAGEMENT CONSOLE</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-800">ログイン</h2>
              <p className="text-sm text-zinc-500 mt-2">店舗管理画面にアクセス</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* メール/パスワードフォーム */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-700">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </button>
            </form>

            {/* 区切り線 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-zinc-500">または</span>
              </div>
            </div>

            {/* Googleログイン */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-zinc-300 text-zinc-700 py-3 px-4 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 transition-all flex items-center justify-center gap-3 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleでログイン
            </button>

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-500">
                まだアカウントをお持ちでない方は
                <Link
                  href="/register"
                  className="text-amber-600 hover:text-amber-700 font-medium ml-1"
                >
                  新規登録
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            ※ショップオーナー専用の管理画面です
          </p>
        </div>
      </div>
    </div>
  );
}
