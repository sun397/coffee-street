import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { supabase } from "@/lib/supabase";
import { CreateProductInput, Product } from "@/types/product";

/**
 * DBの行データ（snake_case）をフロントエンド用の型（camelCase）に変換
 */
const toProduct = (row: Record<string, any>): Product => ({
  id: String(row.id),
  userId: String(row.user_id),
  name: String(row.name),
  origin: String(row.origin),
  level: Number(row.level) as Product["level"],
  tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  price: Number(row.price),
  weight: Number(row.weight),
  archive: Boolean(row.archive),
  createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : new Date().toISOString(),
  updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : new Date().toISOString(),
});

export const inventoryApi = {
  fetchByUserId: async (userId: string): Promise<Product[]> => {
    const result = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (result.error) {
      console.error("Supabase fetchByUserId error:", result.error);
      throw new Error(result.error.message);
    }

    return (result.data ?? []).map(toProduct);
  },

  create: async (product: CreateProductInput): Promise<void> => {
    const { error } = await supabase.from("products").insert({
      user_id: product.userId,
      name: product.name || "名称未設定",
      origin: product.origin || "不明",
      level: product.level ?? 1,
      tags: product.tags ?? [],
      price: product.price ?? 0,
      weight: product.weight ?? 0,
      archive: product.archive ?? false,
    });

    if (error) {
      console.error("Supabase create error:", error);
      throw error;
    }
  },

  update: async (product: Product): Promise<void> => {
    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        origin: product.origin,
        level: product.level,
        tags: product.tags,
        price: product.price,
        weight: product.weight,
        archive: product.archive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .eq("user_id", product.userId);

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
  },

  archive: async (id: string, userId: string, archive: boolean): Promise<void> => {
    const { error } = await supabase
      .from("products")
      .update({
        archive,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase archive error:", error);
      throw error;
    }
  },
};

export const inventoryKeys = {
  all: ["inventories"] as const,
  byUser: (userId: string) => [...inventoryKeys.all, userId] as const,
};

// --- Hooks ---

export function useInventories() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: inventoryKeys.byUser(userId ?? ""),
    queryFn: () => inventoryApi.fetchByUserId(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryFromCache(id?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  if (!id || !user?.id) return undefined;

  const allData: Product[] | undefined = queryClient.getQueryData(inventoryKeys.byUser(user.id));
  return allData?.find(item => item?.id === id);
}

export function useAddInventory() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: Omit<CreateProductInput, "userId">) => {
      const uid = user?.id;
      if (!uid) throw new Error("ユーザーが未認証です");
      return inventoryApi.create({ ...value, userId: uid });
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.id) });
      }
    },
  });
}

export function useUpdateInventory() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: Product) => {
      if (!user?.id) throw new Error("ユーザーが未認証です");
      return inventoryApi.update(value);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.id) });
      }
    },
  });
}

export function useArchiveInventory() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, archive }: { id: string; archive: boolean }) => {
      const uid = user?.id;
      if (!uid) throw new Error("ユーザーが未認証です");
      return inventoryApi.archive(id, uid, archive);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.id) });
      }
    },
  });
}