import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

interface BudgetDonutProps {
  spent: number;
  budget: number;
  title?: string;
}

export function BudgetDonut({ spent, budget, title = "Budget Status" }: BudgetDonutProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const dailyBurnRate = spent / 30;
  const projectedEOM = dailyBurnRate * 30;
  
  const isWarning = percentage > 70;
  const isCritical = percentage > 90;
  
  const data = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: Math.max(remaining, 0) },
  ];
  
  const COLORS = [
    isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#0ea5e9",
    "hsl(var(--muted))",
  ];

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(2)}B`;
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(2)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <Card className="border-2 border-border h-full">
      <CardHeader className="pb-2 border-b-2 border-border">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {title}
          {isWarning && (
            <AlertTriangle className={`w-4 h-4 ${isCritical ? "text-red-500" : "text-amber-500"}`} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative h-[180px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-3xl font-bold ${
                isCritical ? "text-red-500" : isWarning ? "text-amber-500" : "text-primary"
              }`}
            >
              {percentage.toFixed(0)}%
            </span>
            <span className="text-xs text-muted-foreground">of budget</span>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between py-2 border-b-2 border-border">
            <span className="text-sm text-muted-foreground">Spent</span>
            <span className="font-mono font-semibold">
              {formatAmount(spent)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b-2 border-border">
            <span className="text-sm text-muted-foreground">Budget</span>
            <span className="font-mono font-semibold">
              {formatAmount(budget)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b-2 border-border">
            <span className="text-sm text-muted-foreground">Remaining</span>
            <span className={`font-mono font-semibold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>
              {formatAmount(remaining)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b-2 border-border">
            <span className="text-sm text-muted-foreground">Daily Burn Rate</span>
            <span className="font-mono text-sm">
              {formatAmount(dailyBurnRate)}/day
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Projected EOM</span>
            <span className={`font-mono text-sm ${projectedEOM > budget ? "text-red-500" : "text-green-600"}`}>
              {formatAmount(projectedEOM)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
