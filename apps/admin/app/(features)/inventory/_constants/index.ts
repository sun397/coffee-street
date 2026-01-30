import { RoastLevel } from "../types";

export const LOW_STOCK_THRESHOLD = 5;

export const ROAST_LABELS: Record<RoastLevel, string> = {
  1: "浅煎り",
  2: "中浅煎り", 
  3: "中煎り",
  4: "中深煎り",
  5: "深煎り",
};