import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Shop } from "@/types/shop";

interface AuthState {
  user: User | null;
  loading: boolean;
  shopId: string | null;
  shop: Shop | null;
  hasShop: boolean;
  shopLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  _setUser: (user: User | null) => void;
  _setLoading: (loading: boolean) => void;
  _setShop: (shop: Shop | null) => void;
  _setShopLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  shopId: null,
  shop: null,
  hasShop: false,
  shopLoading: true,

  loginWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  },

  loginWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  registerWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  _setUser: (user) =>
    set({
      user,
      shopId: user?.id ?? null,
    }),

  _setLoading: (loading) => set({ loading }),

  _setShop: (shop) =>
    set({
      shop,
      hasShop: shop !== null,
    }),

  _setShopLoading: (shopLoading) => set({ shopLoading }),
}));

// Supabase認証リスナーを初期化する関数
let authUnsubscribeRef: { unsubscribe: () => void } | null = null;
let shopChannelRef: ReturnType<typeof supabase.channel> | null = null;

export function initializeAuthListener() {
  if (authUnsubscribeRef) return; // 既に初期化済み

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      const { _setUser, _setLoading, _setShop, _setShopLoading } =
        useAuthStore.getState();

      const user = session?.user ?? null;
      _setUser(user);
      _setLoading(false);

      // 既存のショップリスナーをクリーンアップ
      if (shopChannelRef) {
        await supabase.removeChannel(shopChannelRef);
        shopChannelRef = null;
      }

      if (!user) {
        _setShop(null);
        _setShopLoading(false);
        return;
      }

      // ショップデータの初回取得
      // NOTE: onAuthStateChange コールバック内で supabase.from() を直接 await すると
      // Supabase v2 の内部ロックによりデッドロックが発生するため、setTimeout で defer する
      _setShopLoading(true);
      setTimeout(async () => {
        const { _setShop, _setShopLoading } = useAuthStore.getState();
        try {
          const { data, error, status } = await supabase
            .from("shops")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          console.log("shops query result:", { data, error, status });
          _setShop((data as Shop) ?? null);
        } catch (err) {
          console.warn("Shop fetch error:", err);
          _setShop(null);
        } finally {
          _setShopLoading(false);
        }
      }, 0);

      // ショップデータのリアルタイム同期
      shopChannelRef = supabase
        .channel(`shop:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "shops",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const { _setShop } = useAuthStore.getState();
            if (payload.eventType === "DELETE") {
              _setShop(null);
            } else {
              _setShop(payload.new as Shop);
            }
          }
        )
        .subscribe();
    }
  );

  authUnsubscribeRef = subscription;
}

export function cleanupAuthListener() {
  if (authUnsubscribeRef) {
    authUnsubscribeRef.unsubscribe();
    authUnsubscribeRef = null;
  }
  if (shopChannelRef) {
    supabase.removeChannel(shopChannelRef);
    shopChannelRef = null;
  }
}

