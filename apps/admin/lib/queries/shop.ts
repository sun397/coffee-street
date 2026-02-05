// apps/admin/lib/queries/shop.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ShopWithId, CreateShopInput, UpdateShopInput } from "@/types/shop";

export const shopQueryKeys = {
  shop: (uid: string) => ["shop", uid] as const,
};

// ショップ情報取得
export function useShop(uid: string | undefined) {
  return useQuery({
    queryKey: shopQueryKeys.shop(uid ?? ""),
    queryFn: async (): Promise<ShopWithId | null> => {
      if (!uid) return null;
      const docRef = doc(db, "shops", uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as ShopWithId;
    },
    enabled: !!uid,
  });
}

// ショップ作成
export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: CreateShopInput }) => {
      const docRef = doc(db, "shops", uid);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: uid, ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.shop(variables.uid) });
    },
  });
}

// ショップ更新
export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: UpdateShopInput }) => {
      const docRef = doc(db, "shops", uid);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return { id: uid, ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.shop(variables.uid) });
    },
  });
}
