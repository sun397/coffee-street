import { create } from "zustand";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  },

  loginWithEmail: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  registerWithEmail: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
  },

  _setUser: (user) =>
    set({
      user,
      shopId: user?.uid ?? null,
    }),

  _setLoading: (loading) => set({ loading }),

  _setShop: (shop) =>
    set({
      shop,
      hasShop: shop !== null,
    }),

  _setShopLoading: (shopLoading) => set({ shopLoading }),
}));

// Firebase認証リスナーを初期化する関数
let authUnsubscribe: Unsubscribe | null = null;
let shopUnsubscribe: Unsubscribe | null = null;

export function initializeAuthListener() {
  if (authUnsubscribe) return; // 既に初期化済み

  const store = useAuthStore.getState();

  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    store._setUser(user);
    store._setLoading(false);

    // 既存のショップリスナーをクリーンアップ
    if (shopUnsubscribe) {
      shopUnsubscribe();
      shopUnsubscribe = null;
    }

    if (!user) {
      store._setShop(null);
      store._setShopLoading(false);
      return;
    }

    // ショップデータのリアルタイム同期
    store._setShopLoading(true);
    const docRef = doc(db, "shops", user.uid);
    shopUnsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          store._setShop(snapshot.data() as Shop);
        } else {
          store._setShop(null);
        }
        store._setShopLoading(false);
      },
      (error) => {
        console.error("Shop fetch error:", error);
        store._setShop(null);
        store._setShopLoading(false);
      }
    );
  });
}

export function cleanupAuthListener() {
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }
  if (shopUnsubscribe) {
    shopUnsubscribe();
    shopUnsubscribe = null;
  }
}
