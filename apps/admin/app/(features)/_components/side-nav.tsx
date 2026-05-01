"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Coffee,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

const NavItem = ({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}) => (
  <Link href={href} className="block no-underline">
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
        active
          ? "bg-stone-800 text-white font-medium"
          : "text-stone-500 hover:text-stone-300 hover:bg-stone-800/50"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);

export const SideNav = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "ダッシュボード",
      href: "/dashboard",
    },
    {
      icon: <ClipboardList size={18} />,
      label: "取り置き予約",
      href: "/reservations",
    },
    {
      icon: <Package size={18} />,
      label: "在庫・商品管理",
      href: "/inventory",
    },
    {
      icon: <Users size={18} />,
      label: "ファンコミュニティ",
      href: "/community",
    },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-2 text-white mb-1">
          <Coffee className="w-6 h-6 text-orange-500" />
          <span className="text-xl font-bold tracking-tight">
            Coffee Street
          </span>
        </div>
        <p className="text-[10px] text-stone-500 font-medium tracking-[0.2em] uppercase">
          Management Console
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <NavItem
          icon={<Settings size={18} />}
          label="設定"
          href="/settings"
          active={pathname.startsWith("/settings")}
        />
      </div>
    </aside>
  );
};
