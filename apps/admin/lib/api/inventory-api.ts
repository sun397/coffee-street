// lib/api/product-api.ts
import { collection, query, where, getDocs } from "firebase/firestore";
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
  create: async (product: Product): Promise<Product[]> => {
    if(USE_DUMMY){
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [...DUMMY_PRODUCTS, product]
    }

    return []
  }
};