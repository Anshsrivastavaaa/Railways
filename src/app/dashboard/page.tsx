import { BarChart3, Clock, Shuffle, Network } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { mockKpis } from "@/lib/mock-data";
import { PunctualityChart } from "@/components/dashboard/punctuality-chart";
import { DelayChart } from "@/components/dashboard/delay-chart";

const icons = [
    <BarChart3 className="h-4 w-4 text-muted-foreground" />,
    <Clock className="h-4 w-4 text-muted-foreground" />,
    <Shuffle className="h-4 w-4 text-muted-foreground" />,
    <Network className="h-4 w-4 text-muted-foreground" />,
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKpis.map((kpi, index) => (
          <KpiCard key={kpi.title} kpi={kpi} icon={icons[index]} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <PunctualityChart />
        <DelayChart />
      </div>
    </div>
  );
}
