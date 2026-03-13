import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// 使用例: Supabaseからデータを取得するQuery
// 実際のテーブル名とTypeは適宜変更してください

interface ExampleDoc {
  id: string;
  name: string;
}

// Query Keys - キャッシュ管理のためのキー定義
export const queryKeys = {
  examples: ["examples"] as const,
  example: (id: string) => ["examples", id] as const,
};

// 一覧取得
export function useExamples() {
  return useQuery({
    queryKey: queryKeys.examples,
    queryFn: async () => {
      const { data, error } = await supabase.from("examples").select("*");
      if (error) throw error;
      return (data ?? []) as ExampleDoc[];
    },
  });
}

// 作成・更新
export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ExampleDoc, "id"> & { id?: string }) => {
      if (data.id) {
        const { data: updated, error } = await supabase
          .from("examples")
          .update({ name: data.name })
          .eq("id", data.id)
          .select()
          .single();
        if (error) throw error;
        return updated as ExampleDoc;
      } else {
        const { data: inserted, error } = await supabase
          .from("examples")
          .insert({ name: data.name })
          .select()
          .single();
        if (error) throw error;
        return inserted as ExampleDoc;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examples });
    },
  });
}
