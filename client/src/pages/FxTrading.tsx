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
import { formatCurrency, formatNumber } from "@/lib/utils";
import { fxDeals, counterparties, type FxDeal } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";
import { useAuth } from "@/hooks/use-auth";
import { DateRangePicker } from "@/components/DateRangePicker";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Repeat,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { exportToExcel, formatFxTradeForExport } from "@/lib/exportUtils";

const fxRates = [
  { pair: "USD/NGN", bid: 1578.50, ask: 1582.50, change: 0.15 },
  { pair: "EUR/NGN", bid: 1720.25, ask: 1725.75, change: -0.08 },
  { pair: "GBP/NGN", bid: 1998.00, ask: 2004.50, change: 0.22 },
  { pair: "CNY/NGN", bid: 218.50, ask: 220.25, change: -0.12 },
];

// Generate unique trade reference
const generateTradeReference = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FX-${timestamp}-${random}`;
};

export default function FxTrading() {
  const { toast } = useToast();
  const { addToQueue } = useCheckerQueue();
  const { user } = useAuth();
  const [selectedPair, setSelectedPair] = useState("USD/NGN");
  const [tradeType, setTradeType] = useState("spot");
  const [buySell, setBuySell] = useState("buy");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Mutable trades state
  const [trades, setTrades] = useState<FxDeal[]>([]);

  // Initialize trades from mock data
  useEffect(() => {
    setTrades([...fxDeals]);
  }, []);

  const filteredTrades = useMemo(() => {
    let result = [...trades];
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (trade) =>
          trade.dealNumber.toLowerCase().includes(searchLower) ||
          trade.sellCurrency.toLowerCase().includes(searchLower) ||
          trade.buyCurrency.toLowerCase().includes(searchLower) ||
          trade.counterpartyName.toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((trade) => trade.status === statusFilter);
    }
    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      result = result.filter((trade) => {
        if (!trade.valueDate) return false;
        const tradeDate = new Date(trade.valueDate);
        return isWithinInterval(tradeDate, {
          start: startOfDay(dateRange.from!),
          end: endOfDay(dateRange.to!),
        });
      });
    }
    return result;
  }, [trades, search, statusFilter, dateRange]);

  const paginatedTrades = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTrades.slice(start, start + pageSize);
  }, [filteredTrades, page]);

  const totalPages = Math.ceil(filteredTrades.length / pageSize);

  const handleExecuteTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trade amount.",
        variant: "destructive",
      });
      return;
    }

    const rate = fxRates.find((r) => r.pair === selectedPair)?.[buySell === "buy" ? "ask" : "bid"] || 0;
    const [sellCurrency, buyCurrency] = selectedPair.split("/");

    const dealNumber = generateTradeReference();
    const now = new Date();
    const newTrade: FxDeal = {
      id: `fx-${Date.now()}`,
      dealNumber,
      tradeType: tradeType as "spot" | "forward" | "ndf" | "swap",
      buyCurrency: buySell === "buy" ? sellCurrency : buyCurrency,
      sellCurrency: buySell === "sell" ? sellCurrency : buyCurrency,
      buyAmount: buySell === "buy" ? parseFloat(amount) : parseFloat(amount) * rate,
      sellAmount: buySell === "sell" ? parseFloat(amount) : parseFloat(amount) * rate,
      rate,
      spotRate: rate,
      forwardPoints: 0,
      valueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // T+2
      tradeDate: now,
      counterpartyId: "CP-001",
      counterpartyName: "Interbank",
      dealerName: user ? `${user.firstName} ${user.lastName}` : "Current User",
      status: "pending",
      settlementStatus: "unsettled",
      createdAt: now,
      updatedAt: now,
    };

    setTrades((prev) => [newTrade, ...prev]);
    setAmount("");

    // Add to checker queue
    addToQueue({
      referenceNumber: dealNumber,
      entityType: tradeType === "spot" ? "FXSPOT" : tradeType === "forward" ? "FXFORWARD" : tradeType === "ndf" ? "FXNDF" : "FXSWAP",
      entityId: newTrade.id,
      action: "create",
      customerName: "Interbank",
      amount: buySell === "sell" ? String(newTrade.sellAmount) : String(newTrade.buyAmount),
      currency: buySell === "sell" ? newTrade.sellCurrency : newTrade.buyCurrency,
      priority: "normal",
      makerId: user?.id || "user-001",
      makerName: user ? `${user.firstName} ${user.lastName}` : "Current User",
      makerDepartment: "Treasury Trading",
      makerComments: `New ${tradeType.toUpperCase()} deal: ${buySell.toUpperCase()} ${amount} ${sellCurrency} at ${rate}`,
      checkerId: null,
      checkerName: null,
      checkerComments: null,
      checkedAt: null,
      description: `FX ${tradeType.toUpperCase()} - ${buySell.toUpperCase()} ${amount} ${sellCurrency}`,
    });

    toast({
      title: "Trade Submitted",
      description: `${dealNumber}: ${buySell.toUpperCase()} ${amount} ${sellCurrency} at ${rate} - Pending checker approval`,
    });
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
            <BreadcrumbPage>FX Trading</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">FX Trading Desk</h1>
            <p className="text-sm text-muted-foreground">
              Execute spot, forward, and swap transactions
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-2 border-border" data-testid="button-refresh-rates">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Rates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 border-b-2 border-border">
              <CardTitle className="text-lg font-semibold">Live Rates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Currency Pair</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Bid</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Ask</th>
                    <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {fxRates.map((rate) => (
                    <tr
                      key={rate.pair}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedPair === rate.pair ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedPair(rate.pair)}
                      data-testid={`row-rate-${rate.pair.replace("/", "-")}`}
                    >
                      <td className="font-medium px-4 py-3 border-2 border-border">{rate.pair}</td>
                      <td className="text-right font-mono px-4 py-3 border-2 border-border">
                        {formatNumber(rate.bid)}
                      </td>
                      <td className="text-right font-mono px-4 py-3 border-2 border-border">
                        {formatNumber(rate.ask)}
                      </td>
                      <td className="text-right px-4 py-3 border-2 border-border">
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            rate.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {rate.change >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-mono">{Math.abs(rate.change)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader className="pb-4 border-b-2 border-border">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search trades..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-56 border-2 border-border"
                        data-testid="input-search-trades"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36 border-2 border-border" data-testid="select-status-filter">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="settled">Settled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="border-2"
                      onClick={() => {
                        const exportData = filteredTrades.map(trade => formatFxTradeForExport({
                          id: trade.id,
                          dealNumber: trade.dealNumber,
                          tradeType: trade.tradeType,
                          buyCurrency: trade.buyCurrency,
                          sellCurrency: trade.sellCurrency,
                          buyAmount: trade.buyAmount,
                          sellAmount: trade.sellAmount,
                          rate: trade.rate,
                          customer: trade.counterpartyName,
                          status: trade.status,
                          tradeDate: trade.tradeDate instanceof Date ? trade.tradeDate.toISOString().split("T")[0] : trade.tradeDate,
                          valueDate: trade.valueDate instanceof Date ? trade.valueDate.toISOString().split("T")[0] : trade.valueDate,
                          trader: trade.dealerName,
                        }));
                        exportToExcel(exportData, "FX_Trades_Export");
                      }}
                      data-testid="button-download-xlsx"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Reference</th>
                      <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Type</th>
                      <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Pair</th>
                      <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Amount</th>
                      <th className="text-right font-semibold text-sm px-4 py-3 border-2 border-border">Rate</th>
                      <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrades.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground border-2 border-border">
                          No trades found
                        </td>
                      </tr>
                    ) : (
                      paginatedTrades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-trade-${trade.id}`}>
                          <td className="font-mono text-sm text-primary px-4 py-3 border-2 border-border">
                            {trade.dealNumber}
                          </td>
                          <td className="px-4 py-3 border-2 border-border">
                            <Badge variant="outline" className="capitalize border-2">
                              {trade.tradeType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 border-2 border-border">{`${trade.sellCurrency}/${trade.buyCurrency}`}</td>
                          <td className="text-right font-mono px-4 py-3 border-2 border-border">
                            {formatCurrency(trade.sellAmount, trade.sellCurrency)}
                          </td>
                          <td className="text-right font-mono px-4 py-3 border-2 border-border">
                            {formatNumber(trade.rate)}
                          </td>
                          <td className="px-4 py-3 border-2 border-border">
                            <Badge
                              variant="secondary"
                              className={
                                trade.status === "settled" || trade.status === "confirmed"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border"
                                  : trade.status === "pending" || trade.status === "verified"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border"
                              }
                              style={{ borderWidth: "1px" }}
                            >
                              {trade.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredTrades.length)} of {filteredTrades.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="border-2 border-border"
                    data-testid="button-prev-page"
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
                    data-testid="button-next-page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 border-b-2 border-border">
              <CardTitle className="text-lg font-semibold">New Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Trade Type</Label>
                <Select value={tradeType} onValueChange={setTradeType}>
                  <SelectTrigger className="border-2 border-border" data-testid="select-trade-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spot">Spot</SelectItem>
                    <SelectItem value="forward">Forward</SelectItem>
                    <SelectItem value="swap">Swap</SelectItem>
                    <SelectItem value="ndf">NDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency Pair</Label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="border-2 border-border" data-testid="select-currency-pair">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fxRates.map((rate) => (
                      <SelectItem key={rate.pair} value={rate.pair}>
                        {rate.pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={buySell === "buy" ? "default" : "outline"}
                  className={`w-full ${buySell !== "buy" ? "border-2 border-border" : ""}`}
                  onClick={() => setBuySell("buy")}
                  data-testid="button-buy"
                >
                  Buy
                </Button>
                <Button
                  variant={buySell === "sell" ? "default" : "outline"}
                  className={`w-full ${buySell !== "sell" ? "border-2 border-border" : ""}`}
                  onClick={() => setBuySell("sell")}
                  data-testid="button-sell"
                >
                  Sell
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Amount ({selectedPair.split("/")[0]})</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-2 border-border"
                  data-testid="input-amount"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg border-2 border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-mono">
                    {fxRates.find((r) => r.pair === selectedPair)?.[
                      buySell === "buy" ? "ask" : "bid"
                    ] || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Settlement</span>
                  <span>T+2</span>
                </div>
                {amount && (
                  <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                    <span>Equivalent</span>
                    <span className="font-mono">
                      NGN{" "}
                      {formatNumber(
                        parseFloat(amount) *
                          (fxRates.find((r) => r.pair === selectedPair)?.[
                            buySell === "buy" ? "ask" : "bid"
                          ] || 0)
                      )}
                    </span>
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleExecuteTrade} data-testid="button-execute-trade">
                <Plus className="w-4 h-4 mr-2" />
                Execute Trade
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader className="pb-3 border-b-2 border-border">
              <CardTitle className="text-lg font-semibold">Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between p-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <span className="font-mono font-medium">USD 1,750,000</span>
              </div>
              <div className="flex justify-between p-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Trades Executed</span>
                <span className="font-mono font-medium">12</span>
              </div>
              <div className="flex justify-between p-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Avg Spread</span>
                <span className="font-mono font-medium">4.0 pips</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-sm text-muted-foreground">P&L</span>
                <span className="font-mono font-medium text-green-600">+NGN 2.4M</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
