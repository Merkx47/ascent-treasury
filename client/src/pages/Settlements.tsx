import { useState, useMemo } from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  Send,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
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
import { settlements } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    settled: {
      label: "Settled",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge className={`${config.className} border`} style={{ borderWidth: "1px" }}>
      {config.label}
    </Badge>
  );
};

export default function Settlements() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSettlement, setSelectedSettlement] = useState<typeof settlements[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate summary stats
  const stats = useMemo(() => {
    const pending = settlements.filter(s => s.status === "pending");
    const today = new Date().toISOString().split("T")[0];
    const dueToday = pending.filter(s => s.settlementDate === today);
    const settled = settlements.filter(s => s.status === "settled");
    const failed = settlements.filter(s => s.status === "failed");

    return {
      totalPending: pending.length,
      pendingAmount: pending.reduce((sum, s) => sum + s.amount, 0),
      dueToday: dueToday.length,
      settledToday: settled.filter(s => s.settlementDate === today).length,
      failedCount: failed.length,
    };
  }, []);

  // Filter settlements
  const filteredSettlements = useMemo(() => {
    return settlements.filter(settlement => {
      if (searchTerm && !settlement.dealReference.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !settlement.counterparty.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && settlement.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && settlement.settlementType !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSettlements.length / pageSize);
  const paginatedSettlements = filteredSettlements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetail = (settlement: typeof settlements[0]) => {
    setSelectedSettlement(settlement);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    // Generate CSV content
    const headers = ["Deal Reference", "Counterparty", "Settlement Type", "Settlement Date", "Amount", "Currency", "Status", "Our Account", "Their Account"];
    const rows = filteredSettlements.map(s => [
      s.dealReference,
      s.counterparty,
      s.settlementType,
      s.settlementDate,
      s.amount.toString(),
      s.currency,
      s.status,
      s.ourAccount,
      s.theirAccount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `settlements_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Settlements report has been downloaded as CSV",
    });
  };

  const handleProcessSettlement = (settlement: typeof settlements[0]) => {
    toast({
      title: "Processing Settlement",
      description: `Settlement ${settlement.dealReference} is being processed`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settlements</h1>
          <p className="text-muted-foreground">
            Manage and process trade settlements
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
                <p className="text-sm text-muted-foreground">Pending Settlements</p>
                <p className="text-2xl font-bold">{stats.totalPending}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(stats.pendingAmount)} total
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.dueToday}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Settled Today</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.settledToday}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failedCount}</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <XCircle className="w-3 h-3 mr-1" />
                  Requires action
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by reference or counterparty..."
                  className="pl-10 h-10 border border-input bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 border border-input bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 border border-input bg-background">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="pay">Pay</SelectItem>
                  <SelectItem value="dvp">DVP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlements Table */}
      <Card className="border-2">
        <CardHeader className="border-b-2 border-border">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Settlement Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="border-2 border-border font-semibold">Deal Reference</TableHead>
                <TableHead className="border-2 border-border font-semibold">Counterparty</TableHead>
                <TableHead className="border-2 border-border font-semibold">Type</TableHead>
                <TableHead className="border-2 border-border font-semibold">Settlement Date</TableHead>
                <TableHead className="border-2 border-border font-semibold text-right">Amount</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Direction</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSettlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="border-2 border-border font-medium font-mono">
                    {settlement.dealReference}
                  </TableCell>
                  <TableCell className="border-2 border-border">{settlement.counterparty}</TableCell>
                  <TableCell className="border-2 border-border">
                    <Badge
                      className={`border ${
                        settlement.settlementType === "receive"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : settlement.settlementType === "pay"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                      style={{ borderWidth: "1px" }}
                    >
                      {settlement.settlementType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-2 border-border">
                    {formatDate(settlement.settlementDate)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-right font-medium">
                    {formatCurrency(settlement.amount, settlement.currency)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    {settlement.settlementType === "receive" ? (
                      <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                    ) : settlement.settlementType === "pay" ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto" />
                    ) : (
                      <span className="text-xs">DVP</span>
                    )}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    {getStatusBadge(settlement.status)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                        onClick={() => handleViewDetail(settlement)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {settlement.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                          onClick={() => handleProcessSettlement(settlement)}
                          title="Process Settlement"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredSettlements.length)} of {filteredSettlements.length} entries
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
        </CardContent>
      </Card>

      {/* Settlement Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-primary" />
              Settlement Details
            </DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <>
              <div className="px-6 py-5 space-y-5 max-h-[calc(80vh-10rem)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Deal Reference</label>
                    <p className="font-semibold font-mono">{selectedSettlement.dealReference}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSettlement.status)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Counterparty</label>
                    <p className="font-semibold">{selectedSettlement.counterparty}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Settlement Type</label>
                    <p className="font-semibold capitalize">{selectedSettlement.settlementType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Settlement Date</label>
                    <p className="font-semibold">{formatDate(selectedSettlement.settlementDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Amount</label>
                    <p className="font-semibold">{formatCurrency(selectedSettlement.amount, selectedSettlement.currency)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Our Account</label>
                    <p className="font-semibold font-mono">{selectedSettlement.ourAccount}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Their Account</label>
                    <p className="font-semibold font-mono">{selectedSettlement.theirAccount}</p>
                  </div>
                </div>
                {selectedSettlement.paymentReference && (
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Payment Reference</label>
                    <p className="font-semibold font-mono">{selectedSettlement.paymentReference}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="px-6">
                  Close
                </Button>
                {selectedSettlement.status === "pending" && (
                  <>
                    <Button variant="outline" className="px-4">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button className="px-6" onClick={() => handleProcessSettlement(selectedSettlement)}>
                      <Send className="w-4 h-4 mr-2" />
                      Process
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
