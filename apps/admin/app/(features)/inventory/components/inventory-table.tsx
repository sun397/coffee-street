"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from "@repo/ui";
import { MoreHorizontal, Edit, Archive, RotateCcw } from "lucide-react";
import { Product, RoastLevel } from "../types";
import { LOW_STOCK_THRESHOLD } from "../_constants";
import { useArchiveInventory } from "@/lib/queries/inventory";

const RoastIndicator = ({ level }: { level: RoastLevel }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-2 h-2 rounded-full",
          i < level ? "bg-stone-800" : "bg-stone-200"
        )}
      />
    ))}
  </div>
);

export type InventoryTableProps = {
  data: Product[];
  onEdit: (product: Product) => void;
}

export const InventoryTable = ({ data, onEdit }: InventoryTableProps) => {
  const archiveMutation = useArchiveInventory();

  const onArchive = (id: string, archive: boolean) => {
    archiveMutation.mutate(
      { id, archive },
      {
        onError: (error) => {
          console.error("アーカイブ操作に失敗しました:", error);
        },
      }
    );
  }

  return (
    <div className="rounded-md border border-stone-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-stone-50/50">
            <TableHead className="font-bold">商品名 / 産地</TableHead>
            <TableHead>焙煎度</TableHead>
            <TableHead>フレーバー</TableHead>
            <TableHead className="text-right">販売価格</TableHead>
            <TableHead className="text-right">在庫量</TableHead>
            <TableHead className="text-center">ステータス</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-stone-500">
                商品データがありません
              </TableCell>
            </TableRow>
          ) : (
          data.map((product: Product) => (
            <TableRow
              key={product.id}
              className={cn(product.archive && "opacity-50")}
            >
              <TableCell>
                <div className="font-medium text-stone-900">{product.name}</div>
                <div className="text-xs text-stone-500">{product.origin}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase">
                    Level {product.roastLevel}
                  </span>
                  <RoastIndicator level={product.roastLevel} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {product.flavorTags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-stone-100 text-stone-600 font-normal hover:bg-stone-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                ¥{product.price.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    product.stockWeight < LOW_STOCK_THRESHOLD && "text-red-600 font-bold"
                  )}
                >
                  {product.stockWeight} kg
                </span>
              </TableCell>
              <TableCell className="text-center">
                {!product.archive ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none">
                    販売中
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-stone-400 border-stone-200"
                  >
                    アーカイブ済
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      aria-label="アクション"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>アクション</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" /> 編集
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!product.archive ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onArchive(product.id, !product.archive)}
                      >
                        <Archive className="mr-2 h-4 w-4" /> アーカイブ
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onArchive(product.id, !product.archive)}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> 復元する
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
