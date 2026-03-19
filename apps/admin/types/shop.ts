export interface Shop {
  name: string;
  description: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface ShopWithId extends Shop {
  id: string;
  user_id: string;
}

export type CreateShopInput = Omit<Shop, "created_at" | "updated_at">;
export type UpdateShopInput = Partial<CreateShopInput>;
