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
import { mockMoneyMarketDeals, mockCounterparties, interestRates, type MoneyMarketDeal } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";
import { useAuth } from "@/hooks/use-auth";
import {
  Wallet,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Building2,
} from "lucide-react";

// Generate unique deal reference
const generateDealReference = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MM-2026-${timestamp.slice(-5)}-${random}`;
};

export default function MoneyMarket() {
  const { toast } = useToast();
  const { addToQueue } = useCheckerQueue();
  const { user } = useAuth();

  const [deals, setDeals] = useState<MoneyMarketDeal[]>([]);
  const [search, setSearch] = useState("");
  const [dealTypeFilter, setDealTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // New Deal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    dealType: "deposit" as "deposit" | "loan" | "tbill" | "call_notice",
    direction: "placed" as "placed" | "taken",
    counterpartyId: "",
    principal: "",
    currency: "NGN",
    rate: "",
    tenor: "1M",
  });

  // Initialize deals
  useEffect(() => {
    setDeals([...mockMoneyMarketDeals]);
  }, []);

  const tenorOptions = [
    { code: "ON", name: "Overnight", days: 1 },
    { code: "1W", name: "1 Week", days: 7 },
    { code: "2W", name: "2 Weeks", days: 14 },
    { code: "1M", name: "1 Month", days: 30 },
    { code: "2M", name: "2 Months", days: 60 },
    { code: "3M", name: "3 Months", days: 90 },
    { code: "6M", name: "6 Months", days: 180 },
    { code: "1Y", name: "1 Year", days: 365 },
  ];

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (deal) =>
          deal.dealNumber.toLowerCase().includes(searchLower) ||
          deal.counterpartyName.toLowerCase().includes(searchLower)
      );
    }
    if (dealTypeFilter !== "all") {
      result = result.filter((deal) => deal.dealType === dealTypeFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((deal) => deal.status === statusFilter);
    }
    return result;
  }, [deals, search, dealTypeFilter, statusFilter]);

  const paginatedDeals = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDeals.slice(start, start + pageSize);
  }, [filteredDeals, page]);

  const totalPages = Math.ceil(filteredDeals.length / pageSize);

  // Summary stats
  const summaryStats = useMemo(() => {
    const activeDeals = deals.filter(d => d.status === "active");
    const totalPlaced = activeDeals.filter(d => d.direction === "placed").reduce((sum, d) => sum + d.principal, 0);
    const totalTaken = activeDeals.filter(d => d.direction === "taken").reduce((sum, d) => sum + d.principal, 0);
    const totalInterest = activeDeals.reduce((sum, d) => sum + d.interest, 0);
    return { totalPlaced, totalTaken, totalInterest, activeCount: activeDeals.length };
  }, [deals]);

  const handleCreateDeal = () => {
    if (!newDeal.counterpartyId || !newDeal.principal || !newDeal.rate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const counterparty = mockCounterparties.find(c => c.id === newDeal.counterpartyId);
    const tenorData = tenorOptions.find(t => t.code === newDeal.tenor);
    const principal = parseFloat(newDeal.principal);
    const rate = parseFloat(newDeal.rate);
    const tenorDays = tenorData?.days || 30;
    const interest = (principal * rate * tenorDays) / (365 * 100);

    const deal: MoneyMarketDeal = {
      id: `mm-${Date.now()}`,
      dealNumber: generateDealReference(),
      dealType: newDeal.dealType,
      direction: newDeal.direction,
      principal,
      currency: newDeal.currency,
      rate,
      rateType: "fixed",
      startDate: new Date(),
      maturityDate: new Date(Date.now() + tenorDays * 24 * 60 * 60 * 1000),
      tenor: newDeal.tenor,
      tenorDays,
      counterpartyId: newDeal.counterpartyId,
      counterpartyName: counterparty?.shortName || "Unknown",
      dealerName: user ? `${user.firstName} ${user.lastName}` : "Current User",
      interest,
      status: "pending",
      createdAt: new Date(),
    };

    setDeals(prev => [deal, ...prev]);

    // Add to checker queue
    addToQueue({
      referenceNumber: deal.dealNumber,
      entityType: newDeal.dealType === "tbill" ? "TBILL" : newDeal.dealType === "deposit" ? "MMDEPOSIT" : "MMLOAN",
      entityId: deal.id,
      action: "create",
      customerName: counterparty?.name || "Unknown",
      amount: String(principal),
      currency: newDeal.currency,
      priority: "normal",
      makerId: user?.id || "user-001",
      makerName: user ? `${user.firstName} ${user.lastName}` : "Current User",
      makerDepartment: "Treasury Front Office",
      makerComments: `${newDeal.dealType.toUpperCase()} ${newDeal.direction} @ ${rate}%`,
      checkerId: null,
      checkerName: null,
      checkerComments: null,
      checkedAt: null,
      description: `Money Market ${newDeal.dealType.toUpperCase()} - ${newDeal.direction} ${newDeal.currency} ${principal}`,
    });

    toast({
      title: "Deal Submitted",
      description: `${deal.dealNumber} submitted for checker approval.`,
    });

    setIsModalOpen(false);
    setNewDeal({
      dealType: "deposit",
      direction: "placed",
      counterpartyId: "",
      principal: "",
      currency: "NGN",
      rate: "",
      tenor: "1M",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      matured: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
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
            <BreadcrumbPage>Money Market</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-500 text-white">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Money Market Trading</h1>
            <p className="text-sm text-muted-foreground">
              Manage deposits, loans, T-Bills, and call/notice transactions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-2 border-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)} data-testid="button-new-deal">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Placements</p>
            </div>
            <p className="text-2xl font-bold mt-1">₦{formatNumber(summaryStats.totalPlaced / 1000000000)}B</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <p className="text-sm text-muted-foreground">Takings</p>
            </div>
            <p className="text-2xl font-bold mt-1">₦{formatNumber(summaryStats.totalTaken / 1000000000)}B</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Accrued Interest</p>
            <p className="text-2xl font-bold mt-1 text-green-600">₦{formatNumber(summaryStats.totalInterest / 1000000)}M</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Deals</p>
            <p className="text-2xl font-bold mt-1">{summaryStats.activeCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Interest Rates Panel */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-2 border-b-2 border-border">
          <CardTitle className="text-sm font-semibold">Market Rates</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-4">
            {interestRates.slice(0, 6).map((rate) => (
              <div key={rate.name} className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                <span className="text-xs font-medium">{rate.name}</span>
                <span className="text-sm font-bold">{rate.rate.toFixed(2)}%</span>
                <span className={`text-xs ${rate.change > 0 ? "text-green-600" : rate.change < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                  {rate.change > 0 ? "+" : ""}{rate.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-4 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Deals Blotter</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56 border-2 border-border"
                />
              </div>
              <Select value={dealTypeFilter} onValueChange={setDealTypeFilter}>
                <SelectTrigger className="w-36 border-2 border-border">
                  <SelectValue placeholder="Deal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="tbill">T-Bill</SelectItem>
                  <SelectItem value="call_notice">Call/Notice</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-2 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="matured">Matured</SelectItem>
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
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Deal #</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Type</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Direction</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Counterparty</th>
                  <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Principal</th>
                  <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Rate</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Tenor</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Maturity</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted-foreground border-2 border-border">
                      No deals found
                    </td>
                  </tr>
                ) : (
                  paginatedDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                      <td className="font-mono text-sm text-primary px-4 py-3 border-2 border-border">
                        {deal.dealNumber}
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge variant="outline" className="capitalize border-2">{deal.dealType.replace("_", "/")}</Badge>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge className={deal.direction === "placed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {deal.direction}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">{deal.counterpartyName}</td>
                      <td className="text-right font-mono px-4 py-3 border-2 border-border">
                        {deal.currency === "NGN" ? "₦" : "$"}{formatNumber(deal.principal)}
                      </td>
                      <td className="text-right font-mono px-4 py-3 border-2 border-border">
                        {deal.rate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 border-2 border-border">{deal.tenor}</td>
                      <td className="px-4 py-3 border-2 border-border text-sm">
                        {deal.maturityDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge className={getStatusBadge(deal.status)}>{deal.status}</Badge>
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
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDeals.length)} of {filteredDeals.length} results
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
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`w-8 ${page !== pageNum ? "border-2 border-border" : ""}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="border-2 border-border"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Deal Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-primary" />
              New Money Market Deal
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5 max-h-[calc(80vh-10rem)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Deal Type</Label>
                <Select value={newDeal.dealType} onValueChange={(v: any) => setNewDeal({ ...newDeal, dealType: v })}>
                  <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="tbill">T-Bill</SelectItem>
                    <SelectItem value="call_notice">Call/Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Direction</Label>
                <Select value={newDeal.direction} onValueChange={(v: any) => setNewDeal({ ...newDeal, direction: v })}>
                  <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placed">Placed (Lend)</SelectItem>
                    <SelectItem value="taken">Taken (Borrow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Counterparty</Label>
              <Select value={newDeal.counterpartyId} onValueChange={(v) => setNewDeal({ ...newDeal, counterpartyId: v })}>
                <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Select counterparty..." />
                </SelectTrigger>
                <SelectContent>
                  {mockCounterparties.filter(c => c.type === "BANK" || c.type === "CBN").map((cp) => (
                    <SelectItem key={cp.id} value={cp.id}>{cp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Principal Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={newDeal.principal}
                  onChange={(e) => setNewDeal({ ...newDeal, principal: e.target.value })}
                  className="h-10 border border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Select value={newDeal.currency} onValueChange={(v) => setNewDeal({ ...newDeal, currency: v })}>
                  <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 22.50"
                  value={newDeal.rate}
                  onChange={(e) => setNewDeal({ ...newDeal, rate: e.target.value })}
                  className="h-10 border border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tenor</Label>
                <Select value={newDeal.tenor} onValueChange={(v) => setNewDeal({ ...newDeal, tenor: v })}>
                  <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tenorOptions.map((t) => (
                      <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deal Preview */}
            {newDeal.principal && newDeal.rate && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                <p className="text-sm font-semibold">Deal Preview</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="text-muted-foreground">Principal:</div>
                  <div className="font-mono font-medium">{newDeal.currency} {formatNumber(parseFloat(newDeal.principal) || 0)}</div>
                  <div className="text-muted-foreground">Rate:</div>
                  <div className="font-mono font-medium">{newDeal.rate}%</div>
                  <div className="text-muted-foreground">Tenor:</div>
                  <div className="font-medium">{tenorOptions.find(t => t.code === newDeal.tenor)?.name}</div>
                  <div className="text-muted-foreground">Est. Interest:</div>
                  <div className="font-mono font-medium text-green-600">
                    {newDeal.currency} {formatNumber(
                      (parseFloat(newDeal.principal) * parseFloat(newDeal.rate) * (tenorOptions.find(t => t.code === newDeal.tenor)?.days || 30)) / (365 * 100)
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="border-t border-border px-6 py-4 gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleCreateDeal} className="px-6">
              Submit Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
