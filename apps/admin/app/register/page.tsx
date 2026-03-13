"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCreateShop } from "@/lib/queries/shop";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { AuthBrandPanel } from "@/components/auth-brand-panel";
import { Button } from "@repo/ui/components/atom/button";
import { Input } from "@repo/ui/components/atom/input";
import { Label } from "@repo/ui/components/atom/label";

export default function ShopRegisterPage() {
  const { user, loginWithGoogle, registerWithEmail } =
    useAuthStore();
  const router = useRouter();
  const createShop = useCreateShop();

  const [step, setStep] = useState<"account" | "shop">("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    if (user && step === "account") {
      setStep("shop");
    }
  }, [user, step]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      console.warn("ログイン失敗:", error);
      setError("Googleログインに失敗しました。");
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithEmail(email, password);
    } catch (error: unknown) {
      console.warn("登録失敗:", error);
      const authError = error as { message?: string };
      if (authError.message?.includes("User already registered")) {
        setError("このメールアドレスは既に使用されています。");
      } else if (authError.message?.includes("Password should be at least")) {
        setError("パスワードは6文字以上で入力してください。");
      } else {
        setError("アカウント登録に失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      await createShop.mutateAsync({
        uid: user.id,
        data: formData,
      });
      router.push("/");
    } catch (error) {
      console.warn("ショップ登録エラー:", error);
      alert("ショップの登録に失敗しました。");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen">
      {/* 左側: ブランドエリア */}
      <AuthBrandPanel />

      {/* 右側: 登録フォーム */}
      <div className="flex-1 flex items-center justify-center bg-zinc-50 p-8">
        <div className="w-full max-w-md">
          {/* モバイル用ロゴ */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
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

          {/* ステップインジケーター */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className={`flex items-center gap-2 ${step === "account" ? "text-amber-600" : "text-zinc-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "account"
                    ? "bg-amber-500 text-white"
                    : user
                      ? "bg-green-500 text-white"
                      : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {user ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">アカウント</span>
            </div>
            <div className="w-8 h-px bg-zinc-300"></div>
            <div
              className={`flex items-center gap-2 ${step === "shop" ? "text-amber-600" : "text-zinc-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "shop" ? "bg-amber-500 text-white" : "bg-zinc-200 text-zinc-500"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">ショップ情報</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            {step === "account" && !user ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-800">アカウント作成</h2>
                  <p className="text-sm text-zinc-500 mt-2">
                    Coffee Streetで販売を始めましょう
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* メール/パスワード登録フォーム */}
                <form onSubmit={handleEmailRegister} className="space-y-4">
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
                      placeholder="6文字以上"
                      required
                      className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-700">
                      パスワード（確認）
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="もう一度入力"
                      required
                      className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    {isSubmitting ? "登録中..." : "アカウントを作成"}
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
                <GoogleSignInButton onClick={handleGoogleLogin} label="Googleで登録" />
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-800">ショップ情報</h2>
                  <p className="text-sm text-zinc-500 mt-2">
                    あなたのショップについて教えてください
                  </p>
                </div>

                <form onSubmit={handleShopSubmit} className="space-y-5">
                  {user && (
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(user.user_metadata?.full_name as string)?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-800 truncate">
                          {(user.user_metadata?.full_name as string) || "新規ユーザー"}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-700">
                      ショップ名
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="例: 山田珈琲店"
                      required
                      className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-zinc-700">
                      所在地
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="例: 東京都渋谷区..."
                      required
                      className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zinc-700">
                      ショップの説明
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="こだわりや特徴を入力"
                      required
                      className="rounded-xl border-zinc-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 font-medium"
                    disabled={createShop.isPending}
                  >
                    {createShop.isPending ? "登録中..." : "ショップを登録する"}
                  </Button>
                </form>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-500">
                すでにアカウントをお持ちの方は
                <Link
                  href="/login"
                  className="text-amber-600 hover:text-amber-700 font-medium ml-1"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            登録することで、利用規約とプライバシーポリシーに同意したものとみなされます
          </p>
        </div>
      </div>
    </div>
  );
}
