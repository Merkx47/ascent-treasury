import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrencyIcon, formatCurrencyAmount } from "./CurrencyIcon";
import { StatusBadge } from "./StatusBadge";
import { DateRangePicker } from "./DateRangePicker";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import type { Transaction } from "@shared/schema";
import { mockCustomers } from "@/lib/mockData";
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { exportToExcel, formatTransactionForExport } from "@/lib/exportUtils";

interface TransactionTableProps {
  transactions: Transaction[];
  title?: string;
  showProductColumn?: boolean;
  onView?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onDuplicate?: (transaction: Transaction) => void;
  onCreate?: () => void;
}

const getNairaEquivalent = (amount: string, currency: string): string => {
  if (currency === "NGN") return "";
  
  const rateMap: Record<string, number> = {
    USD: 1580.50,
    EUR: 1720.30,
    GBP: 2010.75,
    CNY: 218.45,
  };
  
  const rate = rateMap[currency] || 1;
  const nairaAmount = parseFloat(amount) * rate;
  
  if (nairaAmount >= 1000000000) {
    return `₦${(nairaAmount / 1000000000).toFixed(2)}B`;
  }
  if (nairaAmount >= 1000000) {
    return `₦${(nairaAmount / 1000000).toFixed(2)}M`;
  }
  return `₦${nairaAmount.toLocaleString()}`;
};

export function TransactionTable({
  transactions,
  title = "Transactions",
  showProductColumn = true,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onCreate,
}: TransactionTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.referenceNumber.toLowerCase().includes(searchLower) ||
          tx.description?.toLowerCase().includes(searchLower) ||
          mockCustomers.find(c => c.id === tx.customerId)?.name.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((tx) => tx.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      result = result.filter((tx) => {
        if (!tx.createdAt) return false;
        const txDate = new Date(tx.createdAt);
        return isWithinInterval(txDate, {
          start: startOfDay(dateRange.from!),
          end: endOfDay(dateRange.to!),
        });
      });
    }

    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case "amount":
          aVal = parseFloat(a.amount || "0");
          bVal = parseFloat(b.amount || "0");
          break;
        case "createdAt":
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aVal = (a as any)[sortField];
          bVal = (b as any)[sortField];
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [transactions, search, statusFilter, dateRange, sortField, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const getCustomerName = (customerId: string) => {
    return mockCustomers.find(c => c.id === customerId)?.name || "Unknown";
  };

  const productLabels: Record<string, string> = {
    FORMM: "Form M",
    FORMA: "Form A",
    FORMNXP: "Form NXP",
    PAAR: "PAAR",
    IMPORTLC: "Import LC",
    BFC: "Bills for Collection",
    SHIPPINGDOC: "Shipping Docs",
    FXSALES: "FX Sales",
    LOAN: "Trade Loan",
    INWCP: "Inward Payment",
    DOMOUTAC: "Outward Payment",
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="border-2 border-border">
        <CardHeader className="pb-4 border-b-2 border-border">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-2"
                  onClick={() => {
                    const exportData = filteredTransactions.map((tx) =>
                      formatTransactionForExport({
                        ...tx,
                        amount: parseFloat(tx.amount || "0"),
                      })
                    );
                    exportToExcel(exportData, `${title.replace(/\s+/g, "_")}_Export`);
                  }}
                  data-testid="button-download-xlsx"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {onCreate && (
                  <Button onClick={onCreate} data-testid="button-create-new">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64 border-2 border-border"
                  data-testid="input-search-transactions"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 border-2 border-border" data-testid="select-status-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="exception">Exception</SelectItem>
                </SelectContent>
              </Select>
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
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => toggleSort("referenceNumber")}
                    >
                      Reference
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  {showProductColumn && (
                    <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Product</th>
                  )}
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Customer</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">NGN Equiv.</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Status</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Priority</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={showProductColumn ? 9 : 8} className="text-center py-8 text-muted-foreground border-2 border-border">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-testid={`row-transaction-${tx.id}`}
                    >
                      <td className="font-mono text-sm font-medium px-4 py-3 border-2 border-border">
                        {tx.referenceNumber}
                      </td>
                      {showProductColumn && (
                        <td className="px-4 py-3 border-2 border-border">
                          <Badge variant="outline" className="font-normal border-2">
                            {productLabels[tx.productType] || tx.productType}
                          </Badge>
                        </td>
                      )}
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="max-w-[180px] truncate text-sm">
                          {getCustomerName(tx.customerId)}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="flex items-center gap-2">
                          <CurrencyIcon currency={tx.currency || "USD"} />
                          <span className="font-mono font-semibold text-sm">
                            {formatCurrencyAmount(tx.amount || "0", tx.currency || "USD")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <span className="text-xs text-muted-foreground font-mono">
                          {getNairaEquivalent(tx.amount || "0", tx.currency || "USD") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge
                          variant={
                            tx.priority === "urgent"
                              ? "destructive"
                              : tx.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize text-xs"
                        >
                          {tx.priority}
                        </Badge>
                      </td>
                      <td className="text-sm text-muted-foreground px-4 py-3 border-2 border-border">
                        {tx.createdAt ? format(new Date(tx.createdAt), "dd MMM yyyy") : "-"}
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${tx.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView?.(tx)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(tx)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate?.(tx)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete?.(tx)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredTransactions.length)} of {filteredTransactions.length} results
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
                    if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
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
                disabled={page === totalPages}
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
  );
}
