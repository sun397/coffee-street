"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Slider,
} from "@repo/ui";
import { Product } from "../types";

export type ProductFormDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  initialData: Product;
}

export const ProductFormDialog = ({ open, setOpen, initialData }: ProductFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "商品情報の編集" : "新規商品の登録"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">豆の名前</Label>
            <Input id="name" placeholder="エチオピア イルガチェフェ" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">産地</Label>
              <Input id="origin" placeholder="エチオピア" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">販売価格 (100g)</Label>
              <Input id="price" type="number" placeholder="850" />
            </div>
          </div>
          <div className="grid gap-4 pt-2">
            <div className="flex justify-between">
              <Label>焙煎度</Label>
              <span className="text-sm font-bold text-orange-600">
                Level 3 (中煎り)
              </span>
            </div>
            <Slider defaultValue={[3]} max={5} min={1} step={1} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">フレーバータグ (カンマ区切り)</Label>
            <Input id="tags" placeholder="シトラス, フローラル, ベリー" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock">初期在庫量 (kg)</Label>
            <Input id="stock" type="number" step="0.1" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            className="bg-orange-800 hover:bg-orange-900"
            onClick={() => setOpen(false)}
          >
            保存する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
