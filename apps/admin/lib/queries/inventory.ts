import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory-api";
import { useAuth } from "@/context/auth-context";
import { Product } from "@/types/product";

export const inventoryKeys = {
  all: ["inventories"] as const,
  byUser: (userId: string) => [...inventoryKeys.all, userId] as const,
};

export function useInventories() {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: inventoryKeys.byUser(userId ?? ""),
    queryFn: () => inventoryApi.fetchByUserId(userId!),
    enabled: !!userId,
  });
}

export function useInventoryFromCache(id?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  if (!id || !user?.uid) return undefined;

  const allData: Product[] | undefined = queryClient.getQueryData(inventoryKeys.byUser(user.uid));

  return allData?.find(item => item?.id === id);
}

export function useAddInventory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (value: Product) => {
      const uid = user?.uid;
      if (!uid) throw new Error("ユーザーが未認証です");
      return inventoryApi.create({ ...value, userId: uid });
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.uid) });
      }
    },
  });
}

export function useUpdateInventory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (value: Product) => {
      const uid = user?.uid;
      if (!uid) throw new Error("ユーザーが未認証です");
      return inventoryApi.update({ ...value, userId: uid });
    },
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
    mutationFn: ({ id, archive }: { id: string; archive: boolean }) => {
      const uid = user?.uid;
      if (!uid) throw new Error("ユーザーが未認証です");
      return inventoryApi.archive(id, archive);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.byUser(user.uid) });
      }
    }
  })
}