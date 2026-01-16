import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  Calculator,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
} from "recharts";
import { riskMetrics, fxDeals, moneyMarketDeals, bondHoldings } from "@/lib/mockData";

// Generate VAR history data
const varHistoryData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    var95: 2500000 + Math.random() * 1000000,
    var99: 3500000 + Math.random() * 1200000,
    actualPnL: (Math.random() - 0.5) * 2000000,
  };
});

// Limit utilization data
const limitUtilization = [
  { name: "FX Open Position", limit: 50000000, utilized: 35000000, currency: "USD" },
  { name: "Interest Rate Risk", limit: 2000000, utilized: 1450000, currency: "NGN" },
  { name: "Single Counterparty", limit: 10000000, utilized: 7500000, currency: "USD" },
  { name: "Sector Concentration", limit: 30, utilized: 22, currency: "%" },
  { name: "Duration Gap", limit: 5, utilized: 3.2, currency: "years" },
  { name: "Daily Trading Loss", limit: 500000, utilized: 125000, currency: "USD" },
];

// VAR by asset class
const varByAssetClass = [
  { name: "FX", value: 1250000, fill: "#3B82F6" },
  { name: "Money Market", value: 850000, fill: "#10B981" },
  { name: "Fixed Income", value: 650000, fill: "#8B5CF6" },
  { name: "Derivatives", value: 450000, fill: "#F59E0B" },
];

// PV01 by bucket
const pv01Buckets = [
  { bucket: "0-3M", pv01: 12500, exposure: 150000000 },
  { bucket: "3-6M", pv01: 28000, exposure: 280000000 },
  { bucket: "6-12M", pv01: 45000, exposure: 380000000 },
  { bucket: "1-2Y", pv01: 72000, exposure: 420000000 },
  { bucket: "2-5Y", pv01: 125000, exposure: 580000000 },
  { bucket: "5-10Y", pv01: 185000, exposure: 650000000 },
  { bucket: "10Y+", pv01: 95000, exposure: 320000000 },
];

const formatCurrency = (value: number, currency: string = "USD") => {
  if (currency === "%" || currency === "years") {
    return `${value.toFixed(1)}${currency === "%" ? "%" : " yrs"}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RiskManagement() {
  const [location] = useLocation();
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("all");
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>("1d");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<typeof limitUtilization[0] | null>(null);

  // Determine active tab based on route
  const getActiveTab = () => {
    if (location === "/var-analysis") return "var";
    if (location === "/limits") return "limits";
    return "dashboard";
  };

  // Calculate aggregated risk metrics
  const aggregatedMetrics = useMemo(() => {
    const latest = riskMetrics[0];
    return {
      totalVaR95: latest?.portfolioVar95 || 3250000,
      totalVaR99: latest?.portfolioVar99 || 4850000,
      totalPv01: latest?.totalPv01 || 562500,
      totalDv01: latest?.totalPv01 * 0.9 || 485000,
      portfolioGreeks: {
        delta: 2500000,
        gamma: 125000,
        vega: 85000,
        theta: -15000,
      },
    };
  }, []);

  // Stress test scenarios
  const stressScenarios = [
    { name: "Interest Rate +100bp", impact: -4500000, probability: "Medium" },
    { name: "FX Depreciation 10%", impact: -3200000, probability: "High" },
    { name: "Credit Spread +50bp", impact: -1800000, probability: "Low" },
    { name: "Combined Stress", impact: -8500000, probability: "Low" },
  ];

  const getUtilizationColor = (utilized: number, limit: number, isPercentOrYears: boolean) => {
    const ratio = isPercentOrYears ? (utilized / limit) : (utilized / limit);
    if (ratio >= 0.9) return "bg-red-500";
    if (ratio >= 0.75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getUtilizationStatus = (utilized: number, limit: number) => {
    const ratio = utilized / limit;
    if (ratio >= 0.9) return { label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    if (ratio >= 0.75) return { label: "Warning", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { label: "Normal", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">
            Monitor portfolio risk, VAR analysis, and limit utilization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-2">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VaR (95%)</p>
                <p className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.totalVaR95)}</p>
                <p className="text-xs text-muted-foreground mt-1">1-Day Horizon</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VaR (99%)</p>
                <p className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.totalVaR99)}</p>
                <p className="text-xs text-muted-foreground mt-1">1-Day Horizon</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total PV01</p>
                <p className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.totalPv01)}</p>
                <p className="text-xs text-muted-foreground mt-1">Per 1bp move</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio DV01</p>
                <p className="text-2xl font-bold">{formatCurrency(aggregatedMetrics.totalDv01)}</p>
                <p className="text-xs text-muted-foreground mt-1">Dollar Value</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue={getActiveTab()} className="space-y-4">
        <TabsList className="border-2">
          <TabsTrigger value="dashboard">Risk Dashboard</TabsTrigger>
          <TabsTrigger value="var">VAR Analysis</TabsTrigger>
          <TabsTrigger value="limits">Limit Management</TabsTrigger>
          <TabsTrigger value="stress">Stress Testing</TabsTrigger>
        </TabsList>

        {/* Risk Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* VAR History Chart */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  VAR History (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={varHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: "var(--foreground)" }}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "2px solid var(--border)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="var99"
                        name="VaR 99%"
                        stroke="#EF4444"
                        fill="#FEE2E2"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="var95"
                        name="VaR 95%"
                        stroke="#F59E0B"
                        fill="#FEF3C7"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* VAR by Asset Class */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  VAR by Asset Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={varByAssetClass}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {varByAssetClass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "2px solid var(--border)",
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Limit Utilization Summary */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Limit Utilization Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {limitUtilization.map((limit, index) => {
                  const isPercentOrYears = limit.currency === "%" || limit.currency === "years";
                  const utilPercent = (limit.utilized / limit.limit) * 100;
                  const status = getUtilizationStatus(limit.utilized, limit.limit);

                  return (
                    <div
                      key={index}
                      className="p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedLimit(limit);
                        setShowLimitModal(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{limit.name}</span>
                        <Badge className={`${status.color} border`} style={{ borderWidth: "1px" }}>
                          {status.label}
                        </Badge>
                      </div>
                      <Progress
                        value={utilPercent}
                        className="h-2 mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {formatCurrency(limit.utilized, limit.currency)} used
                        </span>
                        <span>
                          {formatCurrency(limit.limit, limit.currency)} limit
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAR Analysis Tab */}
        <TabsContent value="var" className="space-y-4">
          {/* Filters */}
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-48">
                  <label className="text-sm font-medium mb-1 block">Asset Class</label>
                  <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Asset Classes</SelectItem>
                      <SelectItem value="fx">FX</SelectItem>
                      <SelectItem value="mm">Money Market</SelectItem>
                      <SelectItem value="fi">Fixed Income</SelectItem>
                      <SelectItem value="deriv">Derivatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <label className="text-sm font-medium mb-1 block">Time Horizon</label>
                  <Select value={selectedTimeHorizon} onValueChange={setSelectedTimeHorizon}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="10d">10 Days</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PV01 Buckets */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                PV01 by Tenor Bucket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pv01Buckets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bucket" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "pv01" ? formatCurrency(value) : formatCurrency(value),
                        name === "pv01" ? "PV01" : "Exposure"
                      ]}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "2px solid var(--border)",
                      }}
                    />
                    <Bar dataKey="pv01" name="pv01" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* VAR Breakdown Table */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>VAR Breakdown by Position</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="border-2 border-border font-semibold">Position</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Asset Class</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Notional</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">VaR 95%</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">VaR 99%</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border font-medium">USD/NGN Open Position</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border" style={{ borderWidth: "1px" }}>FX</Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">$25,000,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$750,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$1,125,000</TableCell>
                    <TableCell className="border-2 border-border text-right">23.1%</TableCell>
                  </TableRow>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border font-medium">FGN 2029 Bond</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border" style={{ borderWidth: "1px" }}>Fixed Income</Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">₦15,000,000,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$450,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$675,000</TableCell>
                    <TableCell className="border-2 border-border text-right">13.8%</TableCell>
                  </TableRow>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border font-medium">Interbank Placements</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border" style={{ borderWidth: "1px" }}>Money Market</Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">₦50,000,000,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$350,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$525,000</TableCell>
                    <TableCell className="border-2 border-border text-right">10.8%</TableCell>
                  </TableRow>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border font-medium">EUR/USD Forward</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border" style={{ borderWidth: "1px" }}>FX</Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">€10,000,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$280,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$420,000</TableCell>
                    <TableCell className="border-2 border-border text-right">8.6%</TableCell>
                  </TableRow>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border font-medium">Interest Rate Swap Book</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border" style={{ borderWidth: "1px" }}>Derivatives</Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">$100,000,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$320,000</TableCell>
                    <TableCell className="border-2 border-border text-right">$480,000</TableCell>
                    <TableCell className="border-2 border-border text-right">9.8%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limit Management Tab */}
        <TabsContent value="limits" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Trading Limits
                </CardTitle>
                <Button className="border-2">
                  Request Limit Change
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="border-2 border-border font-semibold">Limit Type</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Approved Limit</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Current Utilization</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Available</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Utilization %</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limitUtilization.map((limit, index) => {
                    const utilPercent = (limit.utilized / limit.limit) * 100;
                    const available = limit.limit - limit.utilized;
                    const status = getUtilizationStatus(limit.utilized, limit.limit);

                    return (
                      <TableRow key={index} className="border-b-2">
                        <TableCell className="border-2 border-border font-medium">{limit.name}</TableCell>
                        <TableCell className="border-2 border-border text-right">
                          {formatCurrency(limit.limit, limit.currency)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right">
                          {formatCurrency(limit.utilized, limit.currency)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right">
                          {formatCurrency(available, limit.currency)}
                        </TableCell>
                        <TableCell className="border-2 border-border">
                          <div className="flex items-center gap-2">
                            <Progress value={utilPercent} className="h-2 flex-1" />
                            <span className="text-sm w-12 text-right">{utilPercent.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-2 border-border text-center">
                          <Badge className={`${status.color} border`} style={{ borderWidth: "1px" }}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="border-2 border-border text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2"
                            onClick={() => {
                              setSelectedLimit(limit);
                              setShowLimitModal(true);
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Limit Breach History */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Limit Breaches / Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="border-2 border-border font-semibold">Date</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Limit Type</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Breach Amount</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Duration</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Status</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Resolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border">Jan 14, 2026</TableCell>
                    <TableCell className="border-2 border-border">FX Open Position</TableCell>
                    <TableCell className="border-2 border-border text-red-600 dark:text-red-400">+$2,500,000 (105%)</TableCell>
                    <TableCell className="border-2 border-border">2 hours</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border" style={{ borderWidth: "1px" }}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border">Position squared off</TableCell>
                  </TableRow>
                  <TableRow className="border-b-2">
                    <TableCell className="border-2 border-border">Jan 10, 2026</TableCell>
                    <TableCell className="border-2 border-border">Single Counterparty</TableCell>
                    <TableCell className="border-2 border-border text-yellow-600 dark:text-yellow-400">Warning (92%)</TableCell>
                    <TableCell className="border-2 border-border">4 hours</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border" style={{ borderWidth: "1px" }}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border">Exposure reduced</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stress Testing Tab */}
        <TabsContent value="stress" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Stress Test Scenarios
                </CardTitle>
                <Button variant="outline" className="border-2">
                  Run Stress Test
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="border-2 border-border font-semibold">Scenario</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">P&L Impact</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Probability</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Capital Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stressScenarios.map((scenario, index) => (
                    <TableRow key={index} className="border-b-2">
                      <TableCell className="border-2 border-border font-medium">{scenario.name}</TableCell>
                      <TableCell className="border-2 border-border text-right text-red-600 dark:text-red-400 font-semibold">
                        {formatCurrency(scenario.impact)}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center">
                        <Badge
                          className={`border ${
                            scenario.probability === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : scenario.probability === "Medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                          style={{ borderWidth: "1px" }}
                        >
                          {scenario.probability}
                        </Badge>
                      </TableCell>
                      <TableCell className="border-2 border-border text-center">
                        <Progress value={Math.abs(scenario.impact) / 100000} className="h-2" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Historical Stress Events */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Historical Stress Event Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { event: "2020 COVID", impact: -12500000 },
                      { event: "2016 Naira Float", impact: -8200000 },
                      { event: "2023 Rate Hike", impact: -5400000 },
                      { event: "Current Portfolio", impact: -8500000 },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${(Math.abs(v) / 1000000).toFixed(1)}M`} />
                    <YAxis dataKey="event" type="category" width={120} fontSize={12} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(Math.abs(value))}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "2px solid var(--border)",
                      }}
                    />
                    <Bar dataKey="impact" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Limit Detail Modal */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="max-w-lg border-2">
          <DialogHeader className="border-b-2 border-border pb-4">
            <DialogTitle>Limit Details</DialogTitle>
          </DialogHeader>
          {selectedLimit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Limit Type</label>
                  <p className="font-semibold">{selectedLimit.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Badge
                    className={`${getUtilizationStatus(selectedLimit.utilized, selectedLimit.limit).color} border mt-1`}
                    style={{ borderWidth: "1px" }}
                  >
                    {getUtilizationStatus(selectedLimit.utilized, selectedLimit.limit).label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Approved Limit</label>
                  <p className="font-semibold">{formatCurrency(selectedLimit.limit, selectedLimit.currency)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Utilized</label>
                  <p className="font-semibold">{formatCurrency(selectedLimit.utilized, selectedLimit.currency)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Available</label>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(selectedLimit.limit - selectedLimit.utilized, selectedLimit.currency)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Utilization</label>
                <Progress value={(selectedLimit.utilized / selectedLimit.limit) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1 text-right">
                  {((selectedLimit.utilized / selectedLimit.limit) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="border-t-2 pt-4 flex justify-end gap-2">
                <Button variant="outline" className="border-2" onClick={() => setShowLimitModal(false)}>
                  Close
                </Button>
                <Button className="border-2">Request Increase</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
