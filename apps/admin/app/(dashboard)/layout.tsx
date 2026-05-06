import { SideNav } from "./_components/side-nav";
import { TopHeader } from "./_components/top-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFBF9]">
      {/* 1. サイドバー (左固定) */}
      <SideNav />

      {/* 2. 右側エリア (ヘッダー + コンテンツ) */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        {/* スクロール可能なメインコンテンツ */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
