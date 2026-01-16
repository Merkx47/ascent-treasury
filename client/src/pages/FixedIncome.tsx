import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/utils";
import { mockBondHoldings, type BondHolding } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";
import { useAuth } from "@/hooks/use-auth";
import {
  Building2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PieChart,
  Calendar,
  Eye,
} from "lucide-react";

export default function FixedIncome() {
  const { toast } = useToast();
  const { addToQueue } = useCheckerQueue();
  const { user } = useAuth();

  const [holdings, setHoldings] = useState<BondHolding[]>([]);
  const [search, setSearch] = useState("");
  const [bondTypeFilter, setBondTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Detail Modal State
  const [selectedBond, setSelectedBond] = useState<BondHolding | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Initialize holdings
  useEffect(() => {
    setHoldings([...mockBondHoldings]);
  }, []);

  const filteredHoldings = useMemo(() => {
    let result = [...holdings];
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (bond) =>
          bond.bondName.toLowerCase().includes(searchLower) ||
          bond.isin.toLowerCase().includes(searchLower) ||
          bond.issuer.toLowerCase().includes(searchLower)
      );
    }
    if (bondTypeFilter !== "all") {
      result = result.filter((bond) => bond.bondType === bondTypeFilter);
    }
    return result;
  }, [holdings, search, bondTypeFilter]);

  const paginatedHoldings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredHoldings.slice(start, start + pageSize);
  }, [filteredHoldings, page]);

  const totalPages = Math.ceil(filteredHoldings.length / pageSize);

  // Portfolio Summary
  const portfolioSummary = useMemo(() => {
    const totalFaceValue = holdings.reduce((sum, b) => sum + b.faceValue, 0);
    const totalMarketValue = holdings.reduce((sum, b) => sum + b.marketValue, 0);
    const totalAccruedInterest = holdings.reduce((sum, b) => sum + b.accruedInterest, 0);
    const unrealizedPnL = totalMarketValue - holdings.reduce((sum, b) => sum + (b.faceValue * b.purchasePrice / 100), 0);
    const avgYield = holdings.reduce((sum, b) => sum + b.yield * b.faceValue, 0) / totalFaceValue;
    const avgDuration = holdings.reduce((sum, b) => sum + b.duration * b.faceValue, 0) / totalFaceValue;

    const byType = {
      government: holdings.filter(b => b.bondType === "government").reduce((sum, b) => sum + b.marketValue, 0),
      corporate: holdings.filter(b => b.bondType === "corporate").reduce((sum, b) => sum + b.marketValue, 0),
      eurobond: holdings.filter(b => b.bondType === "eurobond").reduce((sum, b) => sum + b.marketValue, 0),
    };

    return { totalFaceValue, totalMarketValue, totalAccruedInterest, unrealizedPnL, avgYield, avgDuration, byType };
  }, [holdings]);

  const viewBondDetails = (bond: BondHolding) => {
    setSelectedBond(bond);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Fixed Income</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-500 text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Fixed Income Portfolio</h1>
            <p className="text-sm text-muted-foreground">
              Manage government bonds, corporate bonds, and Eurobonds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-2 border-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Mark to Market
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Market Value</p>
            <p className="text-2xl font-bold mt-1">₦{formatNumber(portfolioSummary.totalMarketValue / 1000000000)}B</p>
            <p className="text-xs text-muted-foreground mt-1">
              Face Value: ₦{formatNumber(portfolioSummary.totalFaceValue / 1000000000)}B
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            <p className={`text-2xl font-bold mt-1 ${portfolioSummary.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {portfolioSummary.unrealizedPnL >= 0 ? "+" : ""}₦{formatNumber(portfolioSummary.unrealizedPnL / 1000000)}M
            </p>
            <div className="flex items-center gap-1 text-xs mt-1">
              {portfolioSummary.unrealizedPnL >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={portfolioSummary.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"}>
                {((portfolioSummary.unrealizedPnL / portfolioSummary.totalMarketValue) * 100).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Portfolio Yield</p>
            <p className="text-2xl font-bold mt-1">{portfolioSummary.avgYield.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Weighted Average
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Portfolio Duration</p>
            <p className="text-2xl font-bold mt-1">{portfolioSummary.avgDuration.toFixed(2)} yrs</p>
            <p className="text-xs text-muted-foreground mt-1">
              Modified Duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-2 border-border">
          <CardHeader className="pb-4 border-b-2 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Bond Holdings</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bonds..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-56 border-2 border-border"
                  />
                </div>
                <Select value={bondTypeFilter} onValueChange={setBondTypeFilter}>
                  <SelectTrigger className="w-40 border-2 border-border">
                    <SelectValue placeholder="Bond Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="eurobond">Eurobond</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-2">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Bond</th>
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Type</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Face Value</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Clean Price</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Yield</th>
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Maturity</th>
                    <th className="text-center font-semibold text-sm px-4 py-3 border-2 border-border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHoldings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground border-2 border-border">
                        No bonds found
                      </td>
                    </tr>
                  ) : (
                    paginatedHoldings.map((bond) => (
                      <tr key={bond.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 border-2 border-border">
                          <div className="font-medium text-sm">{bond.bondName}</div>
                          <div className="text-xs text-muted-foreground">{bond.isin}</div>
                        </td>
                        <td className="px-4 py-3 border-2 border-border">
                          <Badge variant="outline" className="capitalize border-2">{bond.bondType}</Badge>
                        </td>
                        <td className="text-right font-mono px-4 py-3 border-2 border-border">
                          {bond.currency === "NGN" ? "₦" : "$"}{formatNumber(bond.faceValue / 1000000)}M
                        </td>
                        <td className="text-right font-mono px-4 py-3 border-2 border-border">
                          {bond.cleanPrice.toFixed(2)}
                        </td>
                        <td className="text-right font-mono px-4 py-3 border-2 border-border">
                          {bond.yield.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 border-2 border-border text-sm">
                          {bond.maturityDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 border-2 border-border text-center">
                          <Button variant="ghost" size="sm" onClick={() => viewBondDetails(bond)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredHoldings.length)} of {filteredHoldings.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="border-2 border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm px-2">{page} / {totalPages || 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="border-2 border-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2 border-b-2 border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-300">Government</p>
                  <p className="text-sm text-muted-foreground">FGN Bonds, State Bonds</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₦{formatNumber(portfolioSummary.byType.government / 1000000000)}B</p>
                  <p className="text-sm text-muted-foreground">
                    {((portfolioSummary.byType.government / portfolioSummary.totalMarketValue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">Corporate</p>
                  <p className="text-sm text-muted-foreground">Bank & Corp Bonds</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₦{formatNumber(portfolioSummary.byType.corporate / 1000000000)}B</p>
                  <p className="text-sm text-muted-foreground">
                    {((portfolioSummary.byType.corporate / portfolioSummary.totalMarketValue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Eurobond</p>
                  <p className="text-sm text-muted-foreground">USD Denominated</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${formatNumber(portfolioSummary.byType.eurobond / 1580 / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">
                    {((portfolioSummary.byType.eurobond / portfolioSummary.totalMarketValue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-border">
              <p className="text-sm font-medium mb-2">Next Coupon Payments</p>
              <div className="space-y-2">
                {holdings.slice(0, 3).map((bond) => (
                  <div key={bond.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-32">{bond.bondName.split(" ").slice(0, 3).join(" ")}</span>
                    </div>
                    <span className="text-muted-foreground">{bond.nextCouponDate.toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bond Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl border-2 border-border">
          <DialogHeader className="border-b-2 border-border pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Bond Details
            </DialogTitle>
          </DialogHeader>
          {selectedBond && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Bond Name</Label>
                    <p className="font-semibold">{selectedBond.bondName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">ISIN</Label>
                    <p className="font-mono">{selectedBond.isin}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Issuer</Label>
                    <p>{selectedBond.issuer}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bond Type</Label>
                    <Badge variant="outline" className="capitalize border-2 mt-1">{selectedBond.bondType}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Face Value</Label>
                    <p className="font-mono font-bold">
                      {selectedBond.currency === "NGN" ? "₦" : "$"}{formatNumber(selectedBond.faceValue)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Market Value</Label>
                    <p className="font-mono font-bold">
                      {selectedBond.currency === "NGN" ? "₦" : "$"}{formatNumber(selectedBond.marketValue)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Coupon Rate</Label>
                    <p className="font-bold">{selectedBond.couponRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Coupon Frequency</Label>
                    <p className="capitalize">{selectedBond.couponFrequency}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border-2 border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Clean Price</p>
                  <p className="font-mono font-bold">{selectedBond.cleanPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Dirty Price</p>
                  <p className="font-mono font-bold">{selectedBond.dirtyPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Yield</p>
                  <p className="font-mono font-bold">{selectedBond.yield.toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-mono font-bold">{selectedBond.duration.toFixed(2)} yrs</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border-2 border-border rounded-lg">
                  <Label className="text-muted-foreground">Issue Date</Label>
                  <p className="font-medium">{selectedBond.issueDate.toLocaleDateString()}</p>
                </div>
                <div className="p-3 border-2 border-border rounded-lg">
                  <Label className="text-muted-foreground">Maturity Date</Label>
                  <p className="font-medium">{selectedBond.maturityDate.toLocaleDateString()}</p>
                </div>
                <div className="p-3 border-2 border-border rounded-lg">
                  <Label className="text-muted-foreground">Next Coupon</Label>
                  <p className="font-medium">{selectedBond.nextCouponDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300">Accrued Interest</p>
                    <p className="font-mono font-bold text-green-800 dark:text-green-200">
                      {selectedBond.currency === "NGN" ? "₦" : "$"}{formatNumber(selectedBond.accruedInterest)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-700 dark:text-green-300">Purchase Price</p>
                    <p className="font-mono font-bold text-green-800 dark:text-green-200">{selectedBond.purchasePrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t-2 border-border pt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="border-2">
              Close
            </Button>
            <Button>Sell Bond</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
