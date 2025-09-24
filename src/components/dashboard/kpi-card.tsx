import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Kpi } from "@/lib/types";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  kpi: Kpi;
  icon: React.ReactNode;
};

export function KpiCard({ kpi, icon }: KpiCardProps) {
  const isIncrease = kpi.changeType === 'increase';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <span className={cn("mr-1", isIncrease ? "text-green-600" : "text-red-600")}>
            {isIncrease ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </span>
          {kpi.change} from last week
        </p>
      </CardContent>
    </Card>
  );
}
