import { collection, query, where, getDocs, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/app/(features)/inventory/types";
import { DUMMY_PRODUCTS } from "./mock/products";

const USE_DUMMY = process.env.NEXT_PUBLIC_USE_DUMMY === "true";

export const inventoryApi = {
  fetchByUserId: async (userId: string): Promise<Product[]> => {
    if (USE_DUMMY) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return DUMMY_PRODUCTS
    }

    const q = query(collection(db, "products"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },
  create: async (product: Product): Promise<void> => {
    if (USE_DUMMY) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Dummy data created:", product);
      return;
    }

    try {
      // 1. "inventories" コレクションの参照を取得
      const inventoryCollection = collection(db, "inventories");
      // 2. 新しいドキュメント参照を先に作成（ここでユニークなIDが生成される）
      const newDocRef = doc(inventoryCollection);

      // 3. 型定義に合わせてデータを整形
      // 取得した ID を含め、時刻はサーバー側で生成
      const newProductData = {
        ...product,
        id: newDocRef.id, // 生成されたIDをセット
        updatedAt: serverTimestamp(), // 保存時はFieldValueとして扱う
      };

      // 4. Firestore に保存
      await setDoc(newDocRef, newProductData);

    } catch (error) {
      console.error("Firestore 登録エラー:", error);
      throw error;
    }
  }
};