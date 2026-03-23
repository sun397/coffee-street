import { useQuery } from "@tanstack/react-query";
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
