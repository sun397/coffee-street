import { MultiSelectOption, RoastLevel } from "@/types/product";

export const LOW_STOCK_THRESHOLD = 5;

export const ROAST_LABELS: Record<RoastLevel, string> = {
  1: "浅煎り",
  2: "中浅煎り", 
  3: "中煎り",
  4: "中深煎り",
  5: "深煎り",
};

export const FLAVORS: MultiSelectOption[] = [
  { id: "1", label: "シトラス" },
  { id: "2", label: "ベリー" },
  { id: "3", label: "ストーンフルーツ" },
  { id: "4", label: "フローラル" },
  { id: "5", label: "チョコレート" },
  { id: "6", label: "ナッティ" },
  { id: "7", label: "キャラメル" },
  { id: "8", label: "ブラウンシュガー" },
  { id: "9", label: "スパイス" },
  { id: "10", label: "ハーブ" }
];