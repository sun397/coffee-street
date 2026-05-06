"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";
import { Filter } from "lucide-react";

interface InventoryFilterProps {
  onReset?: () => void;
  // 今後、選択状態を管理する場合に以下のようなpropsを追加できます
  // selectedStatus?: string;
  // onStatusChange?: (status: string) => void;
}

export function InventoryFilter({ onReset }: InventoryFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-stone-200 bg-white px-3 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-sm gap-2"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">フィルター</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-stone-500 font-normal text-xs">
          表示設定
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>在庫ステータス</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>すべて表示</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>在庫ありのみ</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>欠品中のみ</DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>焙煎度</DropdownMenuLabel>
        <DropdownMenuCheckboxItem>浅煎り</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>中煎り</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>深煎り</DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onReset}
          className="text-orange-800 focus:text-orange-900 focus:bg-orange-50 justify-center font-medium cursor-pointer"
        >
          フィルターをリセット
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}