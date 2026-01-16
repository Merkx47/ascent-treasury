import { useState, useMemo } from "react";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from "recharts";

// Maturity ladder data
const maturityLadder = [
  { bucket: "Today", inflows: 15000000, outflows: 12000000, net: 3000000 },
  { bucket: "Tomorrow", inflows: 8500000, outflows: 5200000, net: 3300000 },
  { bucket: "2-7 Days", inflows: 25000000, outflows: 18000000, net: 7000000 },
  { bucket: "8-14 Days", inflows: 12000000, outflows: 15000000, net: -3000000 },
  { bucket: "15-30 Days", inflows: 35000000, outflows: 28000000, net: 7000000 },
  { bucket: "31-60 Days", inflows: 45000000, outflows: 52000000, net: -7000000 },
  { bucket: "61-90 Days", inflows: 28000000, outflows: 22000000, net: 6000000 },
  { bucket: "91-180 Days", inflows: 65000000, outflows: 45000000, net: 20000000 },
  { bucket: "181-365 Days", inflows: 85000000, outflows: 72000000, net: 13000000 },
  { bucket: "1-2 Years", inflows: 120000000, outflows: 95000000, net: 25000000 },
  { bucket: "2-5 Years", inflows: 180000000, outflows: 150000000, net: 30000000 },
  { bucket: "> 5 Years", inflows: 250000000, outflows: 180000000, net: 70000000 },
];

// Maturity by asset class
const maturityByAsset = [
  { bucket: "Today", fx: 5000000, mm: 8000000, fi: 2000000, deriv: 0 },
  { bucket: "Tomorrow", fx: 3000000, mm: 4500000, fi: 1000000, deriv: 0 },
  { bucket: "2-7 Days", fx: 8000000, mm: 12000000, fi: 5000000, deriv: 0 },
  { bucket: "8-14 Days", fx: 4000000, mm: 6000000, fi: 2000000, deriv: 0 },
  { bucket: "15-30 Days", fx: 10000000, mm: 18000000, fi: 7000000, deriv: 0 },
  { bucket: "31-60 Days", fx: 12000000, mm: 22000000, fi: 11000000, deriv: 0 },
  { bucket: "61-90 Days", fx: 5000000, mm: 15000000, fi: 8000000, deriv: 0 },
  { bucket: "91-180 Days", fx: 8000000, mm: 35000000, fi: 22000000, deriv: 0 },
  { bucket: "181-365 Days", fx: 0, mm: 45000000, fi: 40000000, deriv: 0 },
  { bucket: "1-2 Years", fx: 0, mm: 0, fi: 120000000, deriv: 0 },
  { bucket: "2-5 Years", fx: 0, mm: 0, fi: 180000000, deriv: 0 },
  { bucket: "> 5 Years", fx: 0, mm: 0, fi: 250000000, deriv: 0 },
];

// Currency breakdown
const currencyBreakdown = [
  { currency: "NGN", inflows: 450000000, outflows: 380000000, net: 70000000 },
  { currency: "USD", inflows: 280000000, outflows: 220000000, net: 60000000 },
  { currency: "EUR", inflows: 85000000, outflows: 75000000, net: 10000000 },
  { currency: "GBP", inflows: 53000000, outflows: 45000000, net: 8000000 },
];

const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function MaturityLadder() {
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const [selectedAssetClass, setSelectedAssetClass] = useState("all");

  // Calculate totals
  const totals = useMemo(() => {
    const totalInflows = maturityLadder.reduce((sum, b) => sum + b.inflows, 0);
    const totalOutflows = maturityLadder.reduce((sum, b) => sum + b.outflows, 0);
    const totalNet = totalInflows - totalOutflows;
    const shortTermGap = maturityLadder.slice(0, 5).reduce((sum, b) => sum + b.net, 0);
    return { totalInflows, totalOutflows, totalNet, shortTermGap };
  }, []);

  // Calculate cumulative data
  const cumulativeData = useMemo(() => {
    let cumulative = 0;
    return maturityLadder.map(bucket => {
      cumulative += bucket.net;
      return { ...bucket, cumulative };
    });
  }, []);

  // Identify gap warnings
  const gapWarnings = useMemo(() => {
    return maturityLadder.filter(b => b.net < 0).map(b => b.bucket);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Maturity Ladder</h1>
          <p className="text-muted-foreground">
            Cash flow maturity profile and liquidity gap analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                <p className="text-sm text-muted-foreground">Total Inflows</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totals.totalInflows)}</p>
                <p className="text-xs text-muted-foreground mt-1">All maturities</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outflows</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totals.totalOutflows)}</p>
                <p className="text-xs text-muted-foreground mt-1">All maturities</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ArrowDownRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Position</p>
                <p className={`text-2xl font-bold ${totals.totalNet >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(totals.totalNet)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total liquidity</p>
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
                <p className="text-sm text-muted-foreground">Short-Term Gap (30D)</p>
                <p className={`text-2xl font-bold ${totals.shortTermGap >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(totals.shortTermGap)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {gapWarnings.length > 0 ? `${gapWarnings.length} buckets negative` : "All buckets positive"}
                </p>
              </div>
              <div className={`p-3 ${gapWarnings.length > 0 ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-green-100 dark:bg-green-900/30"} rounded-full`}>
                {gapWarnings.length > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="byasset">By Asset Class</TabsTrigger>
          <TabsTrigger value="bycurrency">By Currency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Chart */}
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Cash Flow Maturity Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bucket" fontSize={11} angle={-45} textAnchor="end" height={80} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="inflows" name="Inflows" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outflows" name="Outflows" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Maturity Table */}
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>Maturity Ladder Detail</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Time Bucket</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Inflows</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Outflows</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Net Position</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Cumulative</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeData.map((bucket, index) => (
                    <TableRow key={index}>
                      <TableCell className="border-2 border-border font-medium">{bucket.bucket}</TableCell>
                      <TableCell className="border-2 border-border text-right font-mono text-green-600 dark:text-green-400">
                        {formatCurrency(bucket.inflows)}
                      </TableCell>
                      <TableCell className="border-2 border-border text-right font-mono text-red-600 dark:text-red-400">
                        {formatCurrency(bucket.outflows)}
                      </TableCell>
                      <TableCell className={`border-2 border-border text-right font-mono font-medium ${
                        bucket.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {bucket.net >= 0 ? "+" : ""}{formatCurrency(bucket.net)}
                      </TableCell>
                      <TableCell className={`border-2 border-border text-right font-mono font-medium ${
                        bucket.cumulative >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {bucket.cumulative >= 0 ? "+" : ""}{formatCurrency(bucket.cumulative)}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center">
                        <Badge
                          className={`border ${
                            bucket.net < 0
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                          style={{ borderWidth: "1px" }}
                        >
                          {bucket.net < 0 ? "Gap" : "Surplus"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell className="border-2 border-border font-bold">Total</TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(totals.totalInflows)}
                    </TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totals.totalOutflows)}
                    </TableCell>
                    <TableCell className={`border-2 border-border text-right font-mono font-bold ${
                      totals.totalNet >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {totals.totalNet >= 0 ? "+" : ""}{formatCurrency(totals.totalNet)}
                    </TableCell>
                    <TableCell className="border-2 border-border"></TableCell>
                    <TableCell className="border-2 border-border"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Asset Class Tab */}
        <TabsContent value="byasset" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>Maturity by Asset Class</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maturityByAsset}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bucket" fontSize={11} angle={-45} textAnchor="end" height={80} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="fx" name="FX" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="mm" name="Money Market" stackId="a" fill="#10B981" />
                    <Bar dataKey="fi" name="Fixed Income" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="deriv" name="Derivatives" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Currency Tab */}
        <TabsContent value="bycurrency" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>Liquidity by Currency</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Currency</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total Inflows</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total Outflows</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Net Position</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencyBreakdown.map((curr, index) => {
                    const totalNet = currencyBreakdown.reduce((sum, c) => sum + c.net, 0);
                    const percentage = (curr.net / totalNet) * 100;
                    return (
                      <TableRow key={index}>
                        <TableCell className="border-2 border-border font-medium">
                          <Badge variant="outline" className="border font-mono">{curr.currency}</Badge>
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono text-green-600 dark:text-green-400">
                          {formatCurrency(curr.inflows, curr.currency)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono text-red-600 dark:text-red-400">
                          {formatCurrency(curr.outflows, curr.currency)}
                        </TableCell>
                        <TableCell className={`border-2 border-border text-right font-mono font-medium ${
                          curr.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {curr.net >= 0 ? "+" : ""}{formatCurrency(curr.net, curr.currency)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono">
                          {percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
