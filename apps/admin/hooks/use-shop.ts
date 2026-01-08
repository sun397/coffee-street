import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@repo/store";

interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
}

export const useShop = () => {
  const { user, loading: authLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const shopQuery = useQuery<Shop>({
    // UIDが確定してからキーを生成する
    queryKey: ["shop", user?.uid],
    queryFn: async () => {
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:8080/api/admin/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch shop");
      return res.json() as Promise<Shop>;
    },
    // ここが肝：user?.uid が null の間は Query を有効化しない
    enabled: !!user?.uid,
  });

  // 更新: useMutation<返り値の型, エラーの型, 引数の型>
  const updateMutation = useMutation<void, Error, Pick<Shop, 'name' | 'description'>>({
    mutationFn: async ({ name, description }) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("http://localhost:8080/api/admin/shop", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
  });

  return { shopQuery, updateMutation };
};
