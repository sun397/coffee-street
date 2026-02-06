"use client";

import { useState } from "react";
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
};

export const ProductFormDialog = ({ productId, setIsOpen }: ProductFormDialogProps) => {
  const product = useInventoryFromCache(productId);
  const [formData, setFormData] = useState<Partial<Product>>(product ?? {});

  const addMutation = useAddInventory();
  const updateMutation = useUpdateInventory();

  const handleSave = () => {
    const submitData = { ...formData } as Product;

    if (!formData?.id) {
      addMutation.mutate(submitData, {
        onSuccess: () => setIsOpen(false),
        onError: (err) => alert("エラー: " + err.message)
      });
    } else {
      updateMutation.mutate({ ...submitData, id: formData.id }, {
        onSuccess: () => setIsOpen(false),
        onError: (err) => alert("エラー: " + err.message)
      });
    }
  };

  return (
    <Dialog open onOpenChange={() => setIsOpen(false)}>
      <DialogContent className={cn("sm:max-w-106.25")} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {productId ? "商品情報の編集" : "新規商品の登録"}
          </DialogTitle>
        </DialogHeader>
        <div className={cn("grid gap-4 py-4")}>

          {/* 商品名 */}
          <div className="grid gap-2">
            <Label htmlFor="name">豆の名前</Label>
            <Input 
              id="name" 
              value={formData.name ?? ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="エチオピア イルガチェフェ" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 産地 */}
            <div className="grid gap-2">
              <Label htmlFor="origin">産地</Label>
              <Input 
                id="origin" 
                value={formData.origin ?? ''}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="エチオピア" 
              />
            </div>
            {/* 価格 */}
            <div className="grid gap-2">
              <Label htmlFor="price">価格 (円)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    price: val === "" ? undefined : Number(val) 
                  });
                }}
              />
            </div>
          </div>

          {/* 焙煎度 */}
          <div className="grid gap-4 pt-2">
            <div className="flex justify-between items-center">
              <Label>焙煎度</Label>
              {(() => {
                const roastLevel = (formData.level ?? 3) as RoastLevel;
                return (
                  <span className={cn("text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded")}>
                    Level {roastLevel} ({ROAST_LABELS[roastLevel]})
                  </span>
                );
              })()}
            </div>
            <Slider
              value={[(formData.level ?? 3) as RoastLevel]} 
              max={5} min={1} step={1} 
              onValueChange={(vals) => setFormData({ ...formData, level: vals[0] as Product['level'] })}
            />
          </div>

          {/* フレーバータグ */}
          {/* <div className="grid gap-2">
            <Label htmlFor="tags">フレーバータグ (カンマ区切り)</Label>
            <Input 
              id="tags" 
              value={formData.tags?.join(", ") ?? ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
              })}
              placeholder="シトラス, フローラル" 
            />
          </div> */}
          {/* フレーバータグ (Combobox化) */}
          <div className="grid gap-2">
            <Label htmlFor="tags">フレーバータグ</Label>
            <MultiSelectTags
              options={FLAVORS}
              selected={formData.tags ?? []}
              onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
            />
          </div>

          {/* 在庫量 */}
          <div className="grid gap-2">
            <Label htmlFor="weight">在庫量 (g)</Label>
            <Input 
              id="weight" 
              type="number" 
              step="0.1" 
              value={formData.weight ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ 
                  ...formData, 
                  weight: val === "" ? undefined : Number(val) 
                });
              }}
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
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {addMutation.isPending || updateMutation.isPending ? "保存中..." : "保存する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};