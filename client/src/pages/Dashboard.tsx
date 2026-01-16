import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Repeat,
  Wallet,
  Building2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  RefreshCw,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  treasuryDashboardStats,
  fxRates,
  interestRates,
  mockPositions,
  mockFxDeals,
  mockSettlements,
  pnlTrendData,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("today");

  const statsCards = [
    {
      title: "FX Volume (Today)",
      value: `$${formatNumber(treasuryDashboardStats.totalFxVolume / 1000000)}M`,
      change: "+12.5%",
      trend: "up",
      icon: Repeat,
      color: "bg-blue-500",
    },
    {
      title: "MM Outstanding",
      value: `₦${formatNumber(treasuryDashboardStats.mmOutstanding / 1000000000)}B`,
      change: "+5.2%",
      trend: "up",
      icon: Wallet,
      color: "bg-green-500",
    },
    {
      title: "Bond Portfolio",
      value: `₦${formatNumber(treasuryDashboardStats.bondPortfolioValue / 1000000000)}B`,
      change: "+2.8%",
      trend: "up",
      icon: Building2,
      color: "bg-purple-500",
    },
    {
      title: "Portfolio VaR (95%)",
      value: `₦${formatNumber(treasuryDashboardStats.portfolioVar95 / 1000000)}M`,
      change: "-8.3%",
      trend: "down",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
  ];

  const pendingSettlements = mockSettlements.filter(s => s.status === "pending").slice(0, 5);
  const recentDeals = mockFxDeals.slice(0, 8);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Treasury Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time treasury operations and risk monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="border-2 border-border px-3 py-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Markets Open
          </Badge>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 border-2 border-border">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="border-2 border-border">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="border-2 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${card.color} text-white`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {card.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {card.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* P&L Trend Chart */}
        <Card className="xl:col-span-2 border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Daily P&L Trend
              </CardTitle>
              <Badge variant="outline" className="border-2">
                Total P&L: <span className="text-green-600 font-bold ml-1">
                  ₦{formatNumber(treasuryDashboardStats.totalPnl / 1000000)}M
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlTrendData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    formatter={(value: number) => [`₦${formatNumber(value)}`, ""]}
                    labelStyle={{ color: "var(--foreground)" }}
                    contentStyle={{ backgroundColor: "var(--background)", border: "2px solid var(--border)" }}
                  />
                  <Area type="monotone" dataKey="totalPnl" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live FX Rates */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Repeat className="w-5 h-5 text-primary" />
              Live FX Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2 divide-border">
              {fxRates.slice(0, 5).map((rate) => (
                <div key={rate.pair} className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="font-medium">{rate.pair}</div>
                  <div className="text-right">
                    <div className="font-mono">{formatNumber(rate.ask)}</div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${
                      rate.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {rate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(rate.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Positions Summary */}
        <Card className="xl:col-span-2 border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Position Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Product</th>
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Currency</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Net Position</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPositions.slice(0, 6).map((pos) => (
                    <tr key={pos.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 border-2 border-border font-medium">{pos.productType}</td>
                      <td className="px-4 py-3 border-2 border-border">{pos.currency}</td>
                      <td className="px-4 py-3 border-2 border-border text-right font-mono">
                        {pos.currency === "NGN" ? "₦" : "$"}{formatNumber(pos.netPosition)}
                      </td>
                      <td className={`px-4 py-3 border-2 border-border text-right font-mono ${
                        pos.unrealizedPnl >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {pos.unrealizedPnl >= 0 ? "+" : ""}₦{formatNumber(pos.unrealizedPnl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Interest Rates */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Interest Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2 divide-border">
              {interestRates.map((rate) => (
                <div key={rate.name} className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="text-sm font-medium">{rate.name}</div>
                  <div className="text-right">
                    <div className="font-mono font-bold">{rate.rate.toFixed(2)}%</div>
                    <div className={`text-xs ${
                      rate.change > 0 ? "text-green-600" : rate.change < 0 ? "text-red-600" : "text-muted-foreground"
                    }`}>
                      {rate.change > 0 ? "+" : ""}{rate.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Recent Deals & Settlements */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent FX Deals */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Repeat className="w-5 h-5 text-primary" />
                Recent FX Deals
              </CardTitle>
              <Button variant="outline" size="sm" className="border-2">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Deal #</th>
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Type</th>
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Pair</th>
                    <th className="text-right font-semibold text-xs px-3 py-2 border-2 border-border">Amount</th>
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 border-2 border-border font-mono text-xs text-primary">
                        {deal.dealNumber}
                      </td>
                      <td className="px-3 py-2 border-2 border-border">
                        <Badge variant="outline" className="text-xs capitalize border-2">{deal.tradeType}</Badge>
                      </td>
                      <td className="px-3 py-2 border-2 border-border text-xs">{deal.buyCurrency}/{deal.sellCurrency}</td>
                      <td className="px-3 py-2 border-2 border-border text-right font-mono text-xs">
                        ${formatNumber(deal.buyCurrency === "USD" ? deal.buyAmount : deal.sellAmount)}
                      </td>
                      <td className="px-3 py-2 border-2 border-border">
                        <Badge variant="secondary" className={`text-xs ${
                          deal.status === "settled" ? "bg-green-100 text-green-700" :
                          deal.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {deal.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pending Settlements */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pending Settlements
                <Badge variant="destructive" className="ml-2">{pendingSettlements.length}</Badge>
              </CardTitle>
              <Button variant="outline" size="sm" className="border-2">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Deal #</th>
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Type</th>
                    <th className="text-left font-semibold text-xs px-3 py-2 border-2 border-border">Counterparty</th>
                    <th className="text-right font-semibold text-xs px-3 py-2 border-2 border-border">Amount</th>
                    <th className="text-center font-semibold text-xs px-3 py-2 border-2 border-border">Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSettlements.map((sett) => (
                    <tr key={sett.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 border-2 border-border font-mono text-xs text-primary">
                        {sett.dealReference}
                      </td>
                      <td className="px-3 py-2 border-2 border-border text-xs">{sett.dealType}</td>
                      <td className="px-3 py-2 border-2 border-border text-xs">{sett.counterparty}</td>
                      <td className="px-3 py-2 border-2 border-border text-right font-mono text-xs">
                        <span className={sett.settlementType === "pay" ? "text-red-600" : "text-green-600"}>
                          {sett.settlementType === "pay" ? "-" : "+"}{sett.currency === "NGN" ? "₦" : "$"}{formatNumber(sett.amount)}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-2 border-border text-center">
                        <Badge className={`text-xs ${sett.settlementType === "pay" ? "bg-red-100 text-red-700" : sett.settlementType === "receive" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} border`} style={{ borderWidth: "1px" }}>
                          {sett.settlementType.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
