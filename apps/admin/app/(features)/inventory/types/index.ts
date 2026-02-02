export type RoastLevel = 1 | 2 | 3 | 4 | 5;

export type Product = {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  flavorTags: string[];
  price: number;
  stockWeight: number;
  archive: boolean;
  updatedAt: string;
};
