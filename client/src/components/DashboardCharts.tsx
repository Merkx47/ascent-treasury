import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const transactionVolumeData = [
  { month: "Jan", volume: 4200, value: 125000000 },
  { month: "Feb", volume: 3800, value: 98000000 },
  { month: "Mar", volume: 5100, value: 156000000 },
  { month: "Apr", volume: 4700, value: 142000000 },
  { month: "May", volume: 5500, value: 178000000 },
  { month: "Jun", volume: 6200, value: 195000000 },
  { month: "Jul", volume: 5800, value: 184000000 },
  { month: "Aug", volume: 6500, value: 212000000 },
  { month: "Sep", volume: 7100, value: 245000000 },
  { month: "Oct", volume: 6800, value: 228000000 },
  { month: "Nov", volume: 7500, value: 267000000 },
  { month: "Dec", volume: 8200, value: 298000000 },
];

const productMixData = [
  { name: "Form M", value: 35, color: "#0ea5e9" },
  { name: "Import LC", value: 25, color: "#06b6d4" },
  { name: "Form A", value: 15, color: "#10b981" },
  { name: "BFC", value: 12, color: "#f59e0b" },
  { name: "FX Sales", value: 8, color: "#ec4899" },
  { name: "Others", value: 5, color: "#6366f1" },
];

const statusDistributionData = [
  { status: "Completed", count: 1250, color: "#10b981" },
  { status: "Pending", count: 340, color: "#f59e0b" },
  { status: "Under Review", count: 180, color: "#3b82f6" },
  { status: "Exception", count: 45, color: "#ef4444" },
];

export function TransactionVolumeChart() {
  return (
    <Card className="border border-card-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Transaction Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={transactionVolumeData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(197, 100%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(197, 100%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="hsl(197, 100%, 40%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductMixChart() {
  return (
    <Card className="border border-card-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Product Mix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productMixData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
                labelLine={false}
              >
                {productMixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {productMixData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusDistributionChart() {
  return (
    <Card className="border border-card-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusDistributionData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis
                type="category"
                dataKey="status"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
