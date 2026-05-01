export type RoastLevel = 1 | 2 | 3 | 4 | 5;

export interface MultiSelectOption {
  id: string;
  label: string;
};

export interface Product {
  id: string;
  userId: string;
  name: string;
  origin: string;
  level: RoastLevel;
  tags: string[];
  price: number;
  weight: number;
  archive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductInput = Partial<CreateProductInput>;