"use client";

import React, { useState, useMemo } from "react";
import { InventoryTable } from "@/app/(dashboard)/inventory/_components/inventory-table";
import { ProductFormDialog } from "@/app/(dashboard)/inventory/_components/product-form-dialog";
import { Button, cn, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input } from "@repo/ui";
import { Plus, Search, Filter } from "lucide-react";
import { useInventories } from "@/lib/queries/inventory";
import { Product } from "@/types/product";
import { PageHeader } from "./_components/page-header";
import { InventoryFilter } from "../_components/inventory-filter";

export default function InventoryPage() {
  const { data: products, isLoading } = useInventories();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;

    const lowerQuery = searchQuery.toLowerCase();
    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.origin?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [products, searchQuery]);

  if (isLoading) return <p className="p-8 text-stone-500">読み込み中...</p>;

  return (
    <div className={cn("p-8 max-w-7xl mx-auto space-y-6")}>
      <PageHeader
        title="在庫・商品管理"
        description="取り扱うコーヒー豆のマスター管理と在庫確認"
      >
        <Button
          onClick={() => {
            setProductId('');
            setIsOpen(true);
          }}
          className="bg-orange-800 hover:bg-orange-900 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          新規商品登録
        </Button>
      </PageHeader>

      {/* 検索・フィルターエリア */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-orange-800" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="商品名、産地で検索"
            className="pl-10 bg-white border-stone-200 shadow-sm focus-visible:ring-orange-800/20 focus-visible:border-orange-800/50 transition-all placeholder:text-stone-400"
            placeholder="商品名、産地で検索..."
          />
        </div>

        <InventoryFilter onReset={() => setSearchQuery('')} />
      </div>

      {/* テーブルにフィルタリング後のデータを渡す */}
      <InventoryTable
        data={filteredProducts}
        onEdit={(value: Product) => {
          setProductId(value.id);
          setIsOpen(true);
        }}
      />

      {isOpen && (
        <ProductFormDialog
          productId={productId}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}