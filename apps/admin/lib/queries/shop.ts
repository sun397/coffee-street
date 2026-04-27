// apps/admin/lib/queries/shop.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", uid)
        .single();
      if (error) return null;
      return data as ShopWithId;
    },
    enabled: !!uid,
  });
}

// ショップ作成
export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: CreateShopInput }) => {
      const { data: shop, error } = await supabase
        .from("shops")
        .insert({ user_id: uid, ...data })
        .select()
        .single();
      if (error) throw error;
      return shop as ShopWithId;
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
      const { data: shop, error } = await supabase
        .from("shops")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("user_id", uid)
        .select()
        .single();
      if (error) throw error;
      return shop as ShopWithId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopQueryKeys.shop(variables.uid) });
    },
  });
}
