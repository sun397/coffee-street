import {
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Coffee,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Store,
  Users
} from "lucide-react";
import React from 'react';

// @repo/ui から一括インポート
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui";

const CoffeeStreetAdmin = () => {
  return (
    <div className="flex min-h-screen bg-[#FDFBF9]">
      {/* サイドバー */}
      <aside className="w-64 bg-stone-900 text-stone-300 hidden md:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2 text-white mb-1">
            <Coffee className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold tracking-tight">Coffee Street</span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium tracking-[0.2em] uppercase">Management Console</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="ダッシュボード" active />
          <NavItem icon={<ClipboardList size={18} />} label="取り置き予約" />
          <NavItem icon={<Package size={18} />} label="在庫・商品管理" />
          <NavItem icon={<Store size={18} />} label="店舗・こだわり設定" />
          <NavItem icon={<Users size={18} />} label="ファンコミュニティ" />
        </nav>

        <div className="p-4 border-t border-stone-800">
          <NavItem icon={<Settings size={18} />} label="設定" />
        </div>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 overflow-y-auto">
        {/* ヘッダー */}
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input className="pl-10 bg-stone-50 border-none h-9 text-sm" placeholder="予約番号、顧客名で検索..." />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-stone-900">Roaster's Lab 自由が丘</p>
              <p className="text-xs text-stone-500">管理者権限</p>
            </div>
            <Avatar className="h-9 w-9 border border-stone-200">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">RL</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 text-balance">本日のロースタリー状況</h2>
              <p className="text-stone-500 mt-1">2026年1月19日(月) — 本日は14件の受取が予定されています</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-stone-200">レポート出力</Button>
              <Button className="bg-orange-800 hover:bg-orange-900 text-white">新規在庫登録</Button>
            </div>
          </div>

          {/* 概要カード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <QuickStat title="未対応予約" value="5" unit="件" status="warning" />
            <QuickStat title="本日の売上見込" value="42,800" unit="円" />
            <QuickStat title="焙煎待ち" value="12.5" unit="kg" />
            <QuickStat title="新規ファン" value="8" unit="人" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側：予約リスト */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm ring-1 ring-stone-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">直近の取り置き予約</CardTitle>
                    <CardDescription>お客様が店舗で受け取る予定の商品です</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-800">
                    すべて見る <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-stone-100">
                        <TableHead className="w-[200px]">顧客名</TableHead>
                        <TableHead>商品</TableHead>
                        <TableHead>時間</TableHead>
                        <TableHead className="text-right">状況</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <ReservationItem name="佐藤 健一" item="エチオピア 200g" time="15:30" status="ready" />
                      <ReservationItem name="高橋 美咲" item="デカフェ ブレンド 100g" time="16:00" status="pending" />
                      <ReservationItem name="鈴木 茂" item="コロンビア 500g" time="18:15" status="pending" />
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* 右側：在庫アラートとこだわり進捗 */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm ring-1 ring-stone-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    在庫アラート
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InventoryItem label="ブラジル サントス" percent={12} color="bg-red-500" />
                  <InventoryItem label="ケニア AA" percent={25} color="bg-amber-500" />
                  <Button variant="outline" className="w-full text-xs h-8 border-stone-200">在庫を補充する</Button>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 text-stone-100 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base font-medium">こだわりの更新</CardTitle>
                  <CardDescription className="text-stone-400 text-xs">
                    新しく入荷した豆のストーリーをデジタル化して、ファンに届けましょう。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-stone-800 border border-stone-700 mb-4">
                    <p className="text-xs text-stone-400 mb-2">公開中のこだわりスコア</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-orange-500">82</span>
                      <span className="text-xs text-stone-500 mb-1">/ 100</span>
                    </div>
                  </div>
                  <Button className="w-full bg-white text-stone-900 hover:bg-stone-100 text-xs">
                    エディタを開く
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- ヘルパーコンポーネント ---

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
    active 
      ? 'bg-stone-800 text-white font-medium' 
      : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
  }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const QuickStat = ({ title, value, unit, status }: any) => (
  <Card className="border-none shadow-sm ring-1 ring-stone-200">
    <CardContent className="p-6">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${status === 'warning' ? 'text-orange-600' : 'text-stone-900'}`}>{value}</span>
        <span className="text-xs text-stone-400">{unit}</span>
      </div>
    </CardContent>
  </Card>
);

const ReservationItem = ({ name, item, time, status }: any) => (
  <TableRow className="border-stone-50">
    <TableCell className="font-medium text-stone-900">{name}</TableCell>
    <TableCell className="text-stone-600">{item}</TableCell>
    <TableCell className="text-stone-600">{time}</TableCell>
    <TableCell className="text-right">
      <Badge variant={status === 'ready' ? 'default' : 'secondary'} className={
        status === 'ready' ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-stone-100 text-stone-500 hover:bg-stone-100'
      }>
        {status === 'ready' ? '準備完了' : '準備中'}
      </Badge>
    </TableCell>
  </TableRow>
);

const InventoryItem = ({ label, percent, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-stone-700">{label}</span>
      <span className="text-stone-500">{percent}%</span>
    </div>
    <Progress value={percent} className="h-1" indicatorClassName={color} />
  </div>
);

export default CoffeeStreetAdmin;