"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input, Avatar, AvatarFallback } from "@repo/ui";

export const TopHeader = () => {
  return (
    <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
        <Input
          className="pl-10 bg-stone-50 border-none h-9 text-sm"
          placeholder="予約番号、顧客名で検索..."
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-stone-900">
            Roaster's Lab 自由が丘
          </p>
          <p className="text-xs text-stone-500">管理者権限</p>
        </div>
        <Avatar className="h-9 w-9 border border-stone-200">
          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
            RL
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
