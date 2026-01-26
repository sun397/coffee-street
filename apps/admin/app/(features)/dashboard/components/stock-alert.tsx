import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
  Button,
} from "@repo/ui";

const InventoryItem = ({ label, percent, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-stone-700">{label}</span>
      <span className="text-stone-500">{percent}%</span>
    </div>
    <Progress value={percent} className="h-1" indicatorClassName={color} />
  </div>
);

export const StockAlert = () => (
  <Card className="border-none shadow-sm ring-1 ring-stone-200">
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        在庫アラート
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <InventoryItem
        label="ブラジル サントス"
        percent={12}
        color="bg-red-500"
      />
      <InventoryItem label="ケニア AA" percent={25} color="bg-amber-500" />
      <Button variant="outline" className="w-full text-xs h-8 border-stone-200">
        在庫を補充する
      </Button>
    </CardContent>
  </Card>
);
