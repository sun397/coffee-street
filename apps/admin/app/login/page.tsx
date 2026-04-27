"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { AuthBrandPanel } from "@/components/auth-brand-panel";
import { Button } from "@repo/ui/components/atom/button";
import { Input } from "@repo/ui/components/atom/input";
import { Label } from "@repo/ui/components/atom/label";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      console.warn("ログイン失敗:", error);
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
      console.warn("ログイン失敗:", error);
      const authError = error as { message?: string };
      if (authError.message?.includes("Invalid login credentials")) {
        setError("メールアドレスまたはパスワードが正しくありません。");
      } else if (authError.message?.includes("Email not confirmed")) {
        setError("メールアドレスの確認が完了していません。");
      } else {
        setError("ログインに失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* 左側: ブランドエリア */}
      <AuthBrandPanel />

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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
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
            <GoogleSignInButton onClick={handleGoogleLogin} label="Googleでログイン" />

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
