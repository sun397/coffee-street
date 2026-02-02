"use client";

import { useEffect, useState } from "react";
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
import { Product, RoastLevel } from "../types";
import { useAddInventory, useUpdateInventory } from "@/lib/queries/inventory";
import { ROAST_LABELS } from "../_constants";

export type ProductFormDialogProps = {
  open: boolean;
  value?: Product;
  setOpen: (value: boolean) => void;
  handleChange: (value?: Product) => void;
};

// 新規登録時のデフォルト値
const getInitialState = (data?: Product): Partial<Product> => {
  if (data) return data;
  return {
    name: "",
    origin: "",
    roastLevel: 3,
    flavorTags: [],
    price: 0,
    stockWeight: 0,
    archive: false,
  };
};

export const ProductFormDialog = ({ open, value, setOpen, handleChange }: ProductFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(getInitialState(value));

  const addMutation = useAddInventory();
  const updateMutation = useUpdateInventory();

  const handleSave = () => {
    const submitData = { ...formData } as Product;

    if (!value?.id) {
      addMutation.mutate(submitData, {
        onSuccess: () => setOpen(false),
        onError: (err) => alert("エラー: " + err.message)
      });
    } else {
      updateMutation.mutate({ ...submitData, id: value.id }, {
        onSuccess: () => {
          setOpen(false);
          handleChange(undefined);
        },
        onError: (err) => alert("エラー: " + err.message)
      });
    }
  };

  useEffect(() => {
    if (open) {
      setFormData(getInitialState(value));
    }
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("sm:max-w-[425px]")} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {value ? "商品情報の編集" : "新規商品の登録"}
          </DialogTitle>
        </DialogHeader>
        <div className={cn("grid gap-4 py-4")}>

          {/* 商品名 */}
          <div className="grid gap-2">
            <Label htmlFor="name">豆の名前</Label>
            <Input 
              id="name" 
              value={formData.name}
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
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="エチオピア" 
              />
            </div>
            {/* 価格 */}
            <div className="grid gap-2">
              <Label htmlFor="price">価格 (100g)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price ?? ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* 焙煎度 */}
          <div className="grid gap-4 pt-2">
            <div className="flex justify-between items-center">
              <Label>焙煎度</Label>
              <span className={cn("text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded")}>
                Level {formData.roastLevel} ({ROAST_LABELS[formData.roastLevel as RoastLevel]})
              </span>
            </div>
            <Slider 
              value={[formData.roastLevel || 3]} 
              max={5} min={1} step={1} 
              onValueChange={(vals) => setFormData({ ...formData, roastLevel: vals[0] as Product['roastLevel'] })}
            />
          </div>

          {/* フレーバータグ */}
          <div className="grid gap-2">
            <Label htmlFor="flavorTags">フレーバータグ (カンマ区切り)</Label>
            <Input 
              id="flavorTags" 
              value={formData.flavorTags?.join(", ")}
              onChange={(e) => setFormData({ 
                ...formData, 
                flavorTags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
              })}
              placeholder="シトラス, フローラル" 
            />
          </div>

          {/* 在庫量 */}
          <div className="grid gap-2">
            <Label htmlFor="stockWeight">在庫量 (kg)</Label>
            <Input 
              id="stockWeight" 
              type="number" 
              step="0.1" 
              value={formData.stockWeight ?? ""}
              onChange={(e) => setFormData({ ...formData, stockWeight: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            className={cn("bg-orange-800 hover:bg-orange-900 min-w-[100px]")}
            onClick={handleSave}
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? "保存中..." : "保存する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};