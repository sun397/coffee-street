// lib/queries/product.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory-api";
import { Product } from "@/app/(features)/inventory/types";

export const inventoryKeys = {
  all: ["inventorys"] as const,
  byUser: (userId: string) => [...inventoryKeys.all, userId] as const,
};

export function useInventorys(userId: string) {
  return useQuery({
    // userIdが変わるたびにキャッシュを分ける
    queryKey: inventoryKeys.byUser(userId), 
    // 実際に叩くAPI
    queryFn: () => inventoryApi.fetchByUserId(userId),
    // userIdが存在するときだけ実行する
    enabled: !!userId, 
  });
}

export function useAddInventory(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: Product) => 
      inventoryApi.create({ ...value }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.byUser(userId ?? '')
      });
    },
  });
}