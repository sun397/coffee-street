import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
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

// 作成・更新
export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ExampleDoc, "id"> & { id?: string }) => {
      const docRef = data.id
        ? doc(db, "examples", data.id)
        : doc(collection(db, "examples"));
      await setDoc(docRef, { name: data.name });
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      // 成功時にキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.examples });
    },
  });
}
