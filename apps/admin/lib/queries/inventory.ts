import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory-api";
import { Product } from "@/app/(features)/inventory/types";
import { useAuth } from "@/context/auth-context";

export const inventoryKeys = {
  all: ["inventories"] as const,
  byUser: (userId: string) => [...inventoryKeys.all, userId] as const,
};

export function useInventories() {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: inventoryKeys.byUser(userId!),
    queryFn: () => inventoryApi.fetchByUserId(userId!),
    // userId が取得できるまでクエリを走らせない
    enabled: !!userId,
  });
}

export function useAddInventory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (value: Product) => inventoryApi.create({ ...value, userId: user?.uid }),
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.uid) });
      }
    },
  });
}

export function useArchiveInventory(){
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, archive}: {id: string, archive: boolean}) => inventoryApi.archive(id, archive),
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.uid) });
      }
    }
  })
}