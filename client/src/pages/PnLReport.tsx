import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// P&L history data
const pnlHistoryData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    realizedPnL: 50000 + Math.random() * 100000,
    unrealizedPnL: (Math.random() - 0.3) * 200000,
    totalPnL: 0,
  };
}).map(d => ({ ...d, totalPnL: d.realizedPnL + d.unrealizedPnL }));

// P&L by product
const pnlByProduct = [
  { product: "FX Spot", realizedPnL: 1250000, unrealizedPnL: 450000 },
  { product: "FX Forward", realizedPnL: 850000, unrealizedPnL: -125000 },
  { product: "MM Deposits", realizedPnL: 2150000, unrealizedPnL: 0 },
  { product: "T-Bills", realizedPnL: 1850000, unrealizedPnL: 320000 },
  { product: "Govt Bonds", realizedPnL: 980000, unrealizedPnL: 1250000 },
  { product: "Corp Bonds", realizedPnL: 450000, unrealizedPnL: -85000 },
  { product: "IRS", realizedPnL: 320000, unrealizedPnL: 180000 },
];

// P&L by trader
const pnlByTrader = [
  { trader: "John Adebayo", desk: "FX", realizedPnL: 1850000, unrealizedPnL: 325000, deals: 45 },
  { trader: "Sarah Okonkwo", desk: "Money Market", realizedPnL: 2150000, unrealizedPnL: 0, deals: 32 },
  { trader: "Michael Chen", desk: "Fixed Income", realizedPnL: 1430000, unrealizedPnL: 1485000, deals: 28 },
  { trader: "Amaka Eze", desk: "FX", realizedPnL: 250000, unrealizedPnL: 125000, deals: 18 },
  { trader: "David Obi", desk: "Derivatives", realizedPnL: 170000, unrealizedPnL: 55000, deals: 12 },
];

// P&L by asset class pie data
const pnlByAssetClass = [
  { name: "FX", value: 2475000, fill: "#3B82F6" },
  { name: "Money Market", value: 2150000, fill: "#10B981" },
  { name: "Fixed Income", value: 2915000, fill: "#8B5CF6" },
  { name: "Derivatives", value: 500000, fill: "#F59E0B" },
];

// Monthly P&L comparison
const monthlyPnL = [
  { month: "Aug", realized: 5200000, unrealized: 1200000 },
  { month: "Sep", realized: 6100000, unrealized: -500000 },
  { month: "Oct", realized: 5800000, unrealized: 800000 },
  { month: "Nov", realized: 7200000, unrealized: 1500000 },
  { month: "Dec", realized: 6500000, unrealized: 2100000 },
  { month: "Jan", realized: 7850000, unrealized: 1990000 },
];

const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PnLReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("mtd");
  const [selectedDesk, setSelectedDesk] = useState("all");

  // Calculate totals
  const totals = useMemo(() => {
    const realizedPnL = pnlByProduct.reduce((sum, p) => sum + p.realizedPnL, 0);
    const unrealizedPnL = pnlByProduct.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    const totalPnL = realizedPnL + unrealizedPnL;
    return { realizedPnL, unrealizedPnL, totalPnL };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">P&L Report</h1>
          <p className="text-muted-foreground">
            Profit and loss analysis across all trading desks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 h-10 border border-input bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="wtd">Week to Date</SelectItem>
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-2">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L (MTD)</p>
                <p className={`text-2xl font-bold ${totals.totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(totals.totalPnL)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8.5% vs last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Realized P&L</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.realizedPnL)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Booked profits
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                <p className={`text-2xl font-bold ${totals.unrealizedPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(totals.unrealizedPnL)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mark to market
                </p>
              </div>
              <div className={`p-3 ${totals.unrealizedPnL >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} rounded-full`}>
                {totals.unrealizedPnL >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's P&L</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$125,450</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  Best day this week
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="byproduct">By Product</TabsTrigger>
          <TabsTrigger value="bytrader">By Trader</TabsTrigger>
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* P&L Trend Chart */}
            <Card className="border-2 lg:col-span-2">
              <CardHeader className="border-b-2 border-border">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  P&L Trend (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pnlHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="realizedPnL"
                        name="Realized"
                        stroke="#10B981"
                        fill="#D1FAE5"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="unrealizedPnL"
                        name="Unrealized"
                        stroke="#3B82F6"
                        fill="#DBEAFE"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* P&L by Asset Class */}
            <Card className="border-2">
              <CardHeader className="border-b-2 border-border pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PieChart className="w-5 h-5" />
                  P&L by Asset Class
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pnlByAssetClass}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pnlByAssetClass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          fontSize: "12px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  {pnlByAssetClass.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.fill }} />
                      <span className="truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Week to Date</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$485,200</p>
                <p className="text-xs text-muted-foreground mt-1">5 trading days</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Month to Date</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(totals.totalPnL)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% vs last month
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Year to Date</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$38,640,000</p>
                <p className="text-xs text-muted-foreground mt-1">On track for annual target</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* By Product Tab */}
        <TabsContent value="byproduct" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                P&L by Product
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Product</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Realized P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Unrealized P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pnlByProduct.map((product, index) => {
                    const totalPnL = product.realizedPnL + product.unrealizedPnL;
                    const grandTotal = pnlByProduct.reduce((sum, p) => sum + p.realizedPnL + p.unrealizedPnL, 0);
                    const percentage = (totalPnL / grandTotal) * 100;

                    return (
                      <TableRow key={index}>
                        <TableCell className="border-2 border-border font-medium">{product.product}</TableCell>
                        <TableCell className="border-2 border-border text-right font-mono text-green-600 dark:text-green-400">
                          +{formatCurrency(product.realizedPnL)}
                        </TableCell>
                        <TableCell className={`border-2 border-border text-right font-mono ${
                          product.unrealizedPnL >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {product.unrealizedPnL >= 0 ? "+" : ""}{formatCurrency(product.unrealizedPnL)}
                        </TableCell>
                        <TableCell className={`border-2 border-border text-right font-mono font-semibold ${
                          totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {totalPnL >= 0 ? "+" : ""}{formatCurrency(totalPnL)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono">
                          {percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell className="border-2 border-border font-bold">Total</TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(totals.realizedPnL)}
                    </TableCell>
                    <TableCell className={`border-2 border-border text-right font-mono font-bold ${
                      totals.unrealizedPnL >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {totals.unrealizedPnL >= 0 ? "+" : ""}{formatCurrency(totals.unrealizedPnL)}
                    </TableCell>
                    <TableCell className={`border-2 border-border text-right font-mono font-bold ${
                      totals.totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {totals.totalPnL >= 0 ? "+" : ""}{formatCurrency(totals.totalPnL)}
                    </TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Trader Tab */}
        <TabsContent value="bytrader" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>P&L by Trader</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Trader</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Desk</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Realized P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Unrealized P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total P&L</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right"># Deals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pnlByTrader.map((trader, index) => {
                    const totalPnL = trader.realizedPnL + trader.unrealizedPnL;
                    return (
                      <TableRow key={index}>
                        <TableCell className="border-2 border-border font-medium">{trader.trader}</TableCell>
                        <TableCell className="border-2 border-border">
                          <Badge variant="outline" className="border">{trader.desk}</Badge>
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono text-green-600 dark:text-green-400">
                          +{formatCurrency(trader.realizedPnL)}
                        </TableCell>
                        <TableCell className={`border-2 border-border text-right font-mono ${
                          trader.unrealizedPnL >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {trader.unrealizedPnL >= 0 ? "+" : ""}{formatCurrency(trader.unrealizedPnL)}
                        </TableCell>
                        <TableCell className={`border-2 border-border text-right font-mono font-semibold ${
                          totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {totalPnL >= 0 ? "+" : ""}{formatCurrency(totalPnL)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono">{trader.deals}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trend" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>Monthly P&L Comparison</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPnL}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="realized" name="Realized" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unrealized" name="Unrealized" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
