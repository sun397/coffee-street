import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 使用例: Firestoreからドキュメントを取得するQuery
// 実際のコレクション名とTypeは適宜変更してください

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
      const snapshot = await getDocs(collection(db, "examples"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ExampleDoc[];
    },
  });
}
