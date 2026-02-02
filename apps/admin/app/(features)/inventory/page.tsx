"use client";

import React, { useState } from "react";
import { InventoryTable } from "@/app/(features)/inventory/components/inventory-table";
import { ProductFormDialog } from "@/app/(features)/inventory/components/product-form-dialog";
import { Button, cn, Input } from "@repo/ui";
import { Plus, Search, Filter } from "lucide-react";
import { useInventories } from "@/lib/queries/inventory";
import { Product } from "./types";

export default function InventoryPage() {
  const { data: products, isLoading } = useInventories();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleEdit = (product: Product) => {
    setIsDialogOpen(true)
  };

  if (isLoading) return <p>読み込み中...</p>;

  return (
    <div className={cn("p-8 max-w-7xl mx-auto space-y-6")}>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            在庫・商品管理
          </h1>
          <p className="text-stone-500 mt-1">
            取り扱うコーヒー豆のマスター管理と在庫確認
          </p>
        </div>
        <Button
          className={cn("bg-orange-800 hover:bg-orange-900")}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> 新規商品登録
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            className="pl-10 bg-white border-stone-200"
            placeholder="商品名、産地で検索..."
          />
        </div>
        <Button variant="outline" size="icon" className="border-stone-200">
          <Filter className="w-4 h-4 text-stone-600" />
        </Button>
      </div>

      <InventoryTable
        data={products ?? []}
        onEdit={handleEdit}
      />

      <ProductFormDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
