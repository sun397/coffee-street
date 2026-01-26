import { Card, CardContent } from "@repo/ui";

interface QuickStatProps {
  title: string;
  value: string;
  unit: string;
  status?: "warning";
}

export const QuickStat = ({ title, value, unit, status }: QuickStatProps) => (
  <Card className="border-none shadow-sm ring-1 ring-stone-200">
    <CardContent className="p-6">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-bold ${
            status === "warning" ? "text-orange-600" : "text-stone-900"
          }`}
        >
          {value}
        </span>
        <span className="text-xs text-stone-400">{unit}</span>
      </div>
    </CardContent>
  </Card>
);
