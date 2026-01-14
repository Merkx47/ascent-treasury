import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { unifiedTransactionTrendData, unifiedTrendStats } from "@/lib/dashboardAggregation";

export function TransactionTrendChart() {
  const todayLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
  return (
    <Card className="border-2 border-border">
      <CardHeader className="pb-4 border-b-2 border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">Transaction Trend</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0ea5e9]" />
                <span className="text-xs text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Forecast</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-2">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Last 30 days with 7-day forecast
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={unifiedTransactionTrendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
                className="text-muted-foreground"
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "2px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number, name: string) => [
                  `₦${(value / 1000000).toFixed(2)}M`,
                  name === "actual" ? "Actual" : "Forecast",
                ]}
              />
              <ReferenceLine
                x={todayLabel}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#actualGradient)"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, fill: "#0ea5e9" }}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#forecastGradient)"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, fill: "#f59e0b" }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-border">
          <div>
            <p className="text-xs text-muted-foreground">30-Day Total</p>
            <p className="text-xl font-bold">₦{(unifiedTrendStats.totalVolume / 1000000000).toFixed(2)}B</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Daily Average</p>
            <p className="text-xl font-bold">₦{(unifiedTrendStats.dailyAverage / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
