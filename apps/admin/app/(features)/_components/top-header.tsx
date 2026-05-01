"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input, Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { useAuthStore } from "@/lib/stores/auth-store";

export const TopHeader = () => {
  const { user } = useAuthStore();

  const displayName =
    (user?.user_metadata as { name?: string } | undefined)?.name ??
    user?.email ??
    "ゲストユーザー";
  const initials = displayName.substring(0, 2).toUpperCase();

  const avatarUrl = (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url;

  return (
    <header className={cn("h-16 border-b border-stone-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10")}>
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
        <Input
          aria-label="予約番号または顧客名で検索"
          className="pl-10 bg-stone-50 border-none h-9 text-sm"
          placeholder="予約番号、顧客名で検索..."
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-stone-900">
            {displayName}
          </p>
          <p className="text-xs text-stone-500">
            管理者権限
          </p>
        </div>

        <Avatar className="h-9 w-9 border border-stone-200">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};