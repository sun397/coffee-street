// apps/admin/types/shop.ts
import { Timestamp } from "firebase/firestore";

export interface Shop {
  name: string;
  description: string;
  location: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ShopWithId extends Shop {
  id: string;
}

export type CreateShopInput = Omit<Shop, "createdAt" | "updatedAt">;
export type UpdateShopInput = Partial<CreateShopInput>;
