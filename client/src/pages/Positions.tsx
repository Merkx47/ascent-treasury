import { useState, useMemo } from "react";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  RefreshCw,
  ArrowUpRight,
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
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { positionSummary } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

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

// Asset allocation data
const assetAllocation = [
  { name: "FX Positions", value: 35000000, fill: "#3B82F6" },
  { name: "Money Market", value: 125000000, fill: "#10B981" },
  { name: "Fixed Income", value: 85000000, fill: "#8B5CF6" },
  { name: "Derivatives", value: 25000000, fill: "#F59E0B" },
];

const formatCurrency = (value: number, currency: string = "USD") => {
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

export default function Positions() {
  const { toast } = useToast();
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("all");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate totals
  const totals = useMemo(() => {
    const totalMTM = positionSummary.reduce((sum, p) => sum + Math.abs(p.netPosition * p.marketRate), 0);
    const totalPnL = positionSummary.reduce((sum, p) => sum + p.unrealizedPnl, 0);
    const realizedPnL = pnlByProduct.reduce((sum, p) => sum + p.realizedPnL, 0);
    const unrealizedPnL = pnlByProduct.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    return { totalMTM, totalPnL, realizedPnL, unrealizedPnL };
  }, []);

  // Filter positions
  const filteredPositions = useMemo(() => {
    return positionSummary.filter(position => {
      if (selectedAssetClass !== "all" && position.productType.toLowerCase() !== selectedAssetClass) {
        return false;
      }
      if (selectedCurrency !== "all" && position.currency !== selectedCurrency) {
        return false;
      }
      return true;
    });
  }, [selectedAssetClass, selectedCurrency]);

  // Pagination
  const totalPages = Math.ceil(filteredPositions.length / pageSize);
  const paginatedPositions = filteredPositions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExport = () => {
    const headers = ["Position", "Asset Class", "Currency", "Quantity", "Market Value", "Unrealized P&L"];
    const rows = filteredPositions.map(p => [
      `${p.productType} - ${p.currency}`,
      p.productType,
      p.currency,
      p.netPosition.toString(),
      (Math.abs(p.netPosition * p.marketRate)).toString(),
      p.unrealizedPnl.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `positions_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Positions report has been downloaded as CSV",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Positions</h1>
          <p className="text-muted-foreground">
            View and manage treasury positions across all asset classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-2" onClick={handleExport}>
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
                <p className="text-sm text-muted-foreground">Total Portfolio MTM</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalMTM)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +2.3% vs yesterday
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
                <p className="text-sm text-muted-foreground">Realized P&L (MTD)</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.realizedPnL)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  YTD: {formatCurrency(totals.realizedPnL * 12)}
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
                  Mark to Market
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
                <p className="text-sm text-muted-foreground">Active Positions</p>
                <p className="text-2xl font-bold">{positionSummary.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all asset classes
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">Asset Class</label>
              <Select value={selectedAssetClass} onValueChange={setSelectedAssetClass}>
                <SelectTrigger className="h-10 border border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Asset Classes</SelectItem>
                  <SelectItem value="fx">FX</SelectItem>
                  <SelectItem value="money market">Money Market</SelectItem>
                  <SelectItem value="fixed income">Fixed Income</SelectItem>
                  <SelectItem value="derivatives">Derivatives</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="h-10 border border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Asset Allocation Chart */}
        <Card className="border-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="w-5 h-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {assetAllocation.map((entry, index) => (
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
              {assetAllocation.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.fill }} />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Positions Table */}
        <Card className="border-2 lg:col-span-3">
          <CardHeader className="border-b-2 border-border">
            <CardTitle>Position Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="border-2 border-border font-semibold">Position</TableHead>
                  <TableHead className="border-2 border-border font-semibold">Asset Class</TableHead>
                  <TableHead className="border-2 border-border font-semibold text-right">Quantity</TableHead>
                  <TableHead className="border-2 border-border font-semibold text-right">Market Value</TableHead>
                  <TableHead className="border-2 border-border font-semibold text-right">Unrealized P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPositions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-2 border-border font-medium">{position.productType} - {position.currency}</TableCell>
                    <TableCell className="border-2 border-border">
                      <Badge
                        className={`border ${
                          position.productType.includes("FX")
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : position.productType.includes("Money")
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : position.productType.includes("Bond") || position.productType.includes("T-Bill")
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                        style={{ borderWidth: "1px" }}
                      >
                        {position.productType}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">
                      {formatNumber(position.netPosition)} {position.currency}
                    </TableCell>
                    <TableCell className="border-2 border-border text-right">
                      {formatCurrency(Math.abs(position.netPosition * position.marketRate), position.currency)}
                    </TableCell>
                    <TableCell className={`border-2 border-border text-right font-medium ${
                      position.unrealizedPnl >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {position.unrealizedPnl >= 0 ? "+" : ""}{formatCurrency(position.unrealizedPnl, position.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredPositions.length)} of {filteredPositions.length} positions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className={currentPage === page ? "" : "border-2"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
