"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Slider,
} from "@repo/ui";
import { Product } from "../types";

export type ProductFormDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  value?: Product;
  handleRegist: (value: Product) => void;
};

// 焙煎度のレベル定義
const ROAST_LEVEL_LABELS: Record<number, string> = {
  1: "浅煎り (Light)",
  2: "中浅煎り (Cinnamon)",
  3: "中煎り (Medium)",
  4: "中深煎り (City)",
  5: "深煎り (French/Italian)",
};

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  setOpen,
  value,
  handleRegist,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<Product>({
    defaultValues: value || {
      roastLevel: 3,
      flavorTags: [],
    },
  });

  // 編集モードの場合、データが変わったらフォームをリセット
  useEffect(() => {
    if (open) {
      reset(value || { roastLevel: 3, flavorTags: [], name: "", origin: "", price: 0, stockWeight: 0 });
    }
  }, [open, value, reset]);

  const currentRoastLevel = watch("roastLevel");

  const onSubmit = (data: Product) => {
    console.log(data)
    // フレーバータグを配列に変換する処理などはここで行う（現在はInputのまま想定）
    // handleRegist(data);
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {value ? "商品情報の編集" : "新規商品の登録"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            {/* 豆の名前 */}
            <div className="grid gap-2">
              <Label htmlFor="name">豆の名前</Label>
              <Input
                id="name"
                {...register("name", { 
                  required: "豆の名前は必須です", 
                  maxLength: { value: 20, message: "20文字以内で入力してください" } 
                })}
                className={errors.name ? "border-red-500" : ""}
                placeholder="エチオピア イルガチェフェ"
              />
              {/* エラーメッセージの表示 */}
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* 産地 & 価格 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origin">産地</Label>
                <Input
                  id="origin"
                  {...register("origin")}
                  placeholder="エチオピア"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">販売価格 (100g)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">円</span>
                </div>
              </div>
            </div>

            {/* 焙煎度 (Slider) */}
            <div className="grid gap-4 pt-2">
              <div className="flex justify-between items-center">
                <Label>焙煎度</Label>
                <span className="text-sm font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                  Level {currentRoastLevel}: {ROAST_LEVEL_LABELS[currentRoastLevel]}
                </span>
              </div>
              <Slider
                value={[currentRoastLevel]}
                onValueChange={(vals) => setValue("roastLevel", vals[0] as any)}
                max={5}
                min={1}
                step={1}
                className="py-2"
              />
            </div>

            {/* フレーバータグ */}
            <div className="grid gap-2">
              <Label htmlFor="tags">フレーバータグ</Label>
              <Input
                id="tags"
                placeholder="シトラス, フローラル, ベリー"
              />
              <p className="text-[10px] text-muted-foreground">カンマ区切りで入力してください</p>
            </div>

            {/* 在庫量 */}
            <div className="grid gap-2">
              <Label htmlFor="stockWeight">初期在庫量 (kg)</Label>
              <Input
                id="stockWeight"
                type="number"
                step="0.1"
                {...register("stockWeight", { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-orange-800 hover:bg-orange-900 text-white min-w-[100px]"
            >
              {value ? "更新する" : "登録する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};