import { ChevronRight } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { ReservationItemDto } from "@/app/(dashboard)/dashboard/types/index";

const ReservationItem = ({ name, item, time, status }: ReservationItemDto) => (
  <TableRow className="border-stone-50">
    <TableCell className="font-medium text-stone-900">{name}</TableCell>
    <TableCell className="text-stone-600">{item}</TableCell>
    <TableCell className="text-stone-600">{time}</TableCell>
    <TableCell className="text-right">
      <Badge
        variant={status === "ready" ? "default" : "secondary"}
        className={cn(
          status === "ready"
            ? "bg-emerald-600 hover:bg-emerald-600"
            : "bg-stone-100 text-stone-500 hover:bg-stone-100"
        )}
      >
        {status === "ready" ? "準備完了" : "準備中"}
      </Badge>
    </TableCell>
  </TableRow>
);

export const ReservationList = () => (
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
            <TableHead className="w-48">顧客名</TableHead>
            <TableHead>商品</TableHead>
            <TableHead>時間</TableHead>
            <TableHead className="text-right">状況</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ReservationItem
            name="佐藤 健一"
            item="エチオピア 200g"
            time="15:30"
            status="ready"
          />
          <ReservationItem
            name="高橋 美咲"
            item="デカフェ ブレンド 100g"
            time="16:00"
            status="pending"
          />
          <ReservationItem
            name="鈴木 茂"
            item="コロンビア 500g"
            time="18:15"
            status="pending"
          />
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
