"use client";

import { useMemo, useState } from "react";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Slider,
} from "@repo/ui";
import { useAddInventory, useInventoryFromCache, useUpdateInventory } from "@/lib/queries/inventory";
import { FLAVORS, ROAST_LABELS } from "../_constants";
import { Product, RoastLevel } from "@/types/product";
import { MultiSelectTags } from "../../_components/MultiSelectTags";

interface ProductFormDialogProps {
  productId?: string;
  setIsOpen: (value: boolean) => void;
}

type ProductFormData = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

const getDefaultProduct = (): ProductFormData => ({
  id: "",
  userId: "",
  name: "",
  origin: "",
  level: 3,
  tags: [],
  price: 0,
  weight: 0,
  archive: false,
});

const isValidProduct = (data: ProductFormData) => {
  return Boolean(data.name && data.origin && data.price >= 0 && data.weight >= 0);
};

export const ProductFormDialog = ({ productId, setIsOpen }: ProductFormDialogProps) => {
  const product = useInventoryFromCache(productId);
  const [formData, setFormData] = useState<ProductFormData>(() => ({
    ...getDefaultProduct(),
    ...(product ?? {}),
  }));

  const addMutation = useAddInventory();
  const updateMutation = useUpdateInventory();

  const isLoading = addMutation.isPending || updateMutation.isPending;
  const isEditMode = Boolean(formData.id);

  const roastLevel = useMemo(() => (formData.level ?? 3) as RoastLevel, [formData.level]);

  const handleChange = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!isValidProduct(formData)) {
      alert("必須項目を正しく入力してください。\n（名称・産地・価格・在庫は必須です）");
      return;
    }

    const submitData = { ...formData } as Product;

    if (!isEditMode) {
      addMutation.mutate(submitData, {
        onSuccess: () => setIsOpen(false),
        onError: (err) => alert("エラー: " + (err as Error).message),
      });
      return;
    }

    updateMutation.mutate(submitData, {
      onSuccess: () => setIsOpen(false),
      onError: (err) => alert("エラー: " + (err as Error).message),
    });
  };

  return (
    <Dialog open onOpenChange={() => setIsOpen(false)}>
      <DialogContent className={cn("sm:max-w-106.25")} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "商品情報の編集" : "新規商品の登録"}</DialogTitle>
        </DialogHeader>

        <div className={cn("grid gap-4 py-4")}>
          <div className="grid gap-2">
            <Label htmlFor="name">豆の名前</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="エチオピア イルガチェフェ"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">産地</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleChange("origin", e.target.value)}
                placeholder="エチオピア"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">価格 (円)</Label>
              <Input
                id="price"
                type="number"
                value={String(formData.price)}
                onChange={(e) => handleChange("price", Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid gap-4 pt-2">
            <div className="flex justify-between items-center">
              <Label>焙煎度</Label>
              <span className={cn("text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded")}>
                Level {roastLevel} ({ROAST_LABELS[roastLevel]})
              </span>
            </div>
            <Slider
              value={[roastLevel]}
              max={5}
              min={1}
              step={1}
              onValueChange={(vals) => handleChange("level", vals[0] as Product["level"])}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">フレーバータグ</Label>
            <MultiSelectTags
              options={FLAVORS}
              selected={formData.tags ?? []}
              onChange={(newTags) => handleChange("tags", newTags)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="weight">在庫量 (g)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={String(formData.weight)}
              onChange={(e) => handleChange("weight", Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button
            className={cn("bg-orange-800 hover:bg-orange-900 min-w-25")}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "保存中..." : "保存する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};