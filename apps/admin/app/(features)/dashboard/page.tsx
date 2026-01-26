"use client";

import React from "react";
import { Button } from "@repo/ui";
import { QuickStat } from "@/app/(features)/dashboard/components/quick-stat";
import { ReservationList } from "@/app/(features)/dashboard/components/reservation-list";
import { StockAlert } from "@/app/(features)/dashboard/components/stock-alert";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 text-balance">
            本日のロースタリー状況
          </h2>
          <p className="text-stone-500 mt-1">
            2026年1月19日(月) — 本日は14件の受取が予定されています
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-stone-200">
            レポート出力
          </Button>
          <Button className="bg-orange-800 hover:bg-orange-900 text-white">
            新規在庫登録
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickStat title="未対応予約" value="5" unit="件" status="warning" />
        <QuickStat title="本日の売上見込" value="42,800" unit="円" />
        <QuickStat title="焙煎待ち" value="12.5" unit="kg" />
        <QuickStat title="新規ファン" value="8" unit="人" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReservationList />
        </div>
        <div>
          <StockAlert />
        </div>
      </div>
    </div>
  );
}
