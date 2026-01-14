import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { mockFxTrades, mockTransactions } from "@/lib/mockData";
import { Repeat, TrendingUp, TrendingDown, RefreshCw, Plus } from "lucide-react";

const fxRates = [
  { pair: "USD/NGN", bid: 1578.50, ask: 1582.50, change: 0.15 },
  { pair: "EUR/NGN", bid: 1720.25, ask: 1725.75, change: -0.08 },
  { pair: "GBP/NGN", bid: 1998.00, ask: 2004.50, change: 0.22 },
  { pair: "CNY/NGN", bid: 218.50, ask: 220.25, change: -0.12 },
];

export default function FxTrading() {
  const [selectedPair, setSelectedPair] = useState("USD/NGN");
  const [tradeType, setTradeType] = useState("spot");
  const [buySell, setBuySell] = useState("buy");
  const [amount, setAmount] = useState("");

  const fxTransactions = mockTransactions.filter((tx) => tx.productType === "FXSALES");

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
          <div className="p-3 rounded-lg bg-pink-500 text-white">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">FX Trading Desk</h1>
            <p className="text-sm text-muted-foreground">
              Execute spot, forward, and swap transactions
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" data-testid="button-refresh-rates">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Rates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Live Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency Pair</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    <TableHead className="text-right">Ask</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fxRates.map((rate) => (
                    <TableRow
                      key={rate.pair}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedPair === rate.pair ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedPair(rate.pair)}
                      data-testid={`row-rate-${rate.pair.replace("/", "-")}`}
                    >
                      <TableCell className="font-medium">{rate.pair}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(rate.bid)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(rate.ask)}
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFxTrades.map((trade) => (
                    <TableRow key={trade.id} data-testid={`row-trade-${trade.id}`}>
                      <TableCell className="font-mono text-sm text-primary">
                        {trade.tradeReference}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {trade.tradeType}
                        </Badge>
                      </TableCell>
                      <TableCell>{`${trade.sellCurrency}/${trade.buyCurrency}`}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(trade.sellAmount, trade.sellCurrency)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(trade.allInRate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            trade.settlementStatus === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }
                        >
                          {trade.settlementStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">New Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trade Type</Label>
                <Select value={tradeType} onValueChange={setTradeType}>
                  <SelectTrigger data-testid="select-trade-type">
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
                  <SelectTrigger data-testid="select-currency-pair">
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
                  className="w-full"
                  onClick={() => setBuySell("buy")}
                  data-testid="button-buy"
                >
                  Buy
                </Button>
                <Button
                  variant={buySell === "sell" ? "default" : "outline"}
                  className="w-full"
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
                  data-testid="input-amount"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
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
                  <div className="flex justify-between text-sm font-medium pt-2 border-t">
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

              <Button className="w-full" data-testid="button-execute-trade">
                <Plus className="w-4 h-4 mr-2" />
                Execute Trade
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <span className="font-mono font-medium">USD 1,750,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trades Executed</span>
                <span className="font-mono font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Spread</span>
                <span className="font-mono font-medium">4.0 pips</span>
              </div>
              <div className="flex justify-between">
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
