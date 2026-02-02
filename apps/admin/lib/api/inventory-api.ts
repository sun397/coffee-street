import { collection, query, where, getDocs, serverTimestamp, doc, setDoc, updateDoc } from "firebase/firestore";
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

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data, 
        id: doc.id, 
        updatedAt: data.updatedAt?.toDate 
          ? data.updatedAt.toDate().toISOString() 
          : new Date().toISOString(), 
      } as Product;
    });
  },
  create: async (product: Product): Promise<void> => {
    if (USE_DUMMY) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Dummy data created:", product);
      return;
    }

    try {
      const productsCollection = collection(db, "products");
      const newDocRef = doc(productsCollection);

      const newProductData = {
        ...product,
        id: newDocRef.id,
        updatedAt: serverTimestamp(),
      };

      await setDoc(newDocRef, newProductData);

    } catch (error) {
      console.error("Firestore 登録エラー:", error);
      throw error;
    }
  },
  update: async (product: Product): Promise<void> => {
    if (USE_DUMMY) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Dummy data updated:", product);
      return;
    }

    try {
      const productRef = doc(db, "products", product.id);

      const newProductData = {
        ...product,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(productRef, newProductData);

    } catch (error) {
      console.error("Firestore 更新エラー:", error);
      throw error;
    }
  },
  archive: async (id: string, archive: boolean): Promise<void> => {
    if(USE_DUMMY){
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Dummy data archive");
      return;
    }

    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        archive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firestore 更新エラー:", error);
      throw error;
    }
  }
};