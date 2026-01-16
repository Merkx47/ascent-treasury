import { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  Send,
  XCircle,
  Eye,
  Printer,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Confirmation data
const confirmationsData = [
  {
    id: "CONF-2026-001",
    dealRef: "FX-2026-001234",
    type: "FX Spot",
    counterparty: "Access Bank",
    counterpartyContact: "treasury@accessbank.com",
    tradeDate: "2026-01-15",
    valueDate: "2026-01-17",
    buyCurrency: "USD",
    buyAmount: 5000000,
    sellCurrency: "NGN",
    sellAmount: 7850000000,
    rate: 1570.00,
    status: "confirmed",
    sentDate: "2026-01-15",
    confirmedDate: "2026-01-15",
    ourReference: "UBN-FX-2026-001234",
    theirReference: "ACC-FX-78945",
  },
  {
    id: "CONF-2026-002",
    dealRef: "MM-2026-000456",
    type: "Deposit Placement",
    counterparty: "Zenith Bank",
    counterpartyContact: "money.market@zenithbank.com",
    tradeDate: "2026-01-14",
    valueDate: "2026-01-14",
    buyCurrency: "NGN",
    buyAmount: 10000000000,
    sellCurrency: null,
    sellAmount: null,
    rate: 22.50,
    status: "pending",
    sentDate: "2026-01-14",
    confirmedDate: null,
    ourReference: "UBN-MM-2026-000456",
    theirReference: null,
  },
  {
    id: "CONF-2026-003",
    dealRef: "FX-2026-001235",
    type: "FX Forward",
    counterparty: "GTBank",
    counterpartyContact: "fx.desk@gtbank.com",
    tradeDate: "2026-01-13",
    valueDate: "2026-02-13",
    buyCurrency: "EUR",
    buyAmount: 2000000,
    sellCurrency: "NGN",
    sellAmount: 3400000000,
    rate: 1700.00,
    status: "disputed",
    sentDate: "2026-01-13",
    confirmedDate: null,
    ourReference: "UBN-FX-2026-001235",
    theirReference: "GTB-12345",
    disputeReason: "Rate discrepancy - counterparty claims 1695.00",
  },
  {
    id: "CONF-2026-004",
    dealRef: "BOND-2026-078",
    type: "Bond Purchase",
    counterparty: "First Bank",
    counterpartyContact: "fixed.income@firstbanknigeria.com",
    tradeDate: "2026-01-12",
    valueDate: "2026-01-14",
    buyCurrency: "NGN",
    buyAmount: 500000000,
    sellCurrency: null,
    sellAmount: null,
    rate: 18.75,
    status: "confirmed",
    sentDate: "2026-01-12",
    confirmedDate: "2026-01-12",
    ourReference: "UBN-FI-2026-000078",
    theirReference: "FBN-BD-2026-445",
  },
  {
    id: "CONF-2026-005",
    dealRef: "IRS-2026-012",
    type: "Interest Rate Swap",
    counterparty: "Stanbic IBTC",
    counterpartyContact: "derivatives@stanbicibtc.com",
    tradeDate: "2026-01-11",
    valueDate: "2026-01-13",
    buyCurrency: "NGN",
    buyAmount: 5000000000,
    sellCurrency: null,
    sellAmount: null,
    rate: null,
    status: "pending",
    sentDate: "2026-01-11",
    confirmedDate: null,
    ourReference: "UBN-IRS-2026-000012",
    theirReference: null,
  },
  {
    id: "CONF-2026-006",
    dealRef: "FX-2026-001240",
    type: "FX Swap",
    counterparty: "UBA",
    counterpartyContact: "treasury@ubagroup.com",
    tradeDate: "2026-01-10",
    valueDate: "2026-01-12",
    buyCurrency: "USD",
    buyAmount: 10000000,
    sellCurrency: "NGN",
    sellAmount: 15700000000,
    rate: 1570.00,
    status: "confirmed",
    sentDate: "2026-01-10",
    confirmedDate: "2026-01-11",
    ourReference: "UBN-FXS-2026-000015",
    theirReference: "UBA-SWAP-8875",
  },
];

const formatCurrency = (value: number | null, currency: string | null) => {
  if (value === null || currency === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle2,
    },
    disputed: {
      label: "Disputed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: AlertTriangle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} border`} style={{ borderWidth: "1px" }}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default function Confirmations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedConfirmation, setSelectedConfirmation] = useState<typeof confirmationsData[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Stats
  const stats = useMemo(() => {
    return {
      total: confirmationsData.length,
      pending: confirmationsData.filter(c => c.status === "pending").length,
      confirmed: confirmationsData.filter(c => c.status === "confirmed").length,
      disputed: confirmationsData.filter(c => c.status === "disputed").length,
    };
  }, []);

  // Filter confirmations
  const filteredConfirmations = useMemo(() => {
    return confirmationsData.filter(conf => {
      if (searchTerm && !conf.dealRef.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !conf.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !conf.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && conf.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && !conf.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const handleViewDetail = (conf: typeof confirmationsData[0]) => {
    setSelectedConfirmation(conf);
    setShowDetailModal(true);
  };

  const handleSendConfirmation = (conf: typeof confirmationsData[0]) => {
    setSelectedConfirmation(conf);
    setShowSendModal(true);
  };

  const handleSend = () => {
    toast({
      title: "Confirmation Sent",
      description: `Confirmation ${selectedConfirmation?.id} has been sent to ${selectedConfirmation?.counterparty}`,
    });
    setShowSendModal(false);
  };

  const handleBulkSend = () => {
    const pendingCount = confirmationsData.filter(c => c.status === "pending").length;
    toast({
      title: "Bulk Confirmations Sent",
      description: `${pendingCount} pending confirmations have been sent`,
    });
  };

  const handleExport = () => {
    // Generate CSV content
    const headers = ["Confirmation ID", "Deal Reference", "Type", "Counterparty", "Trade Date", "Value Date", "Buy Amount", "Buy Currency", "Sell Amount", "Sell Currency", "Rate", "Status"];
    const rows = filteredConfirmations.map(conf => [
      conf.id,
      conf.dealRef,
      conf.type,
      conf.counterparty,
      conf.tradeDate,
      conf.valueDate,
      conf.buyAmount?.toString() || "",
      conf.buyCurrency || "",
      conf.sellAmount?.toString() || "",
      conf.sellCurrency || "",
      conf.rate?.toString() || "",
      conf.status,
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
    link.setAttribute("download", `trade_confirmations_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Confirmations report has been downloaded as CSV",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Confirmations</h1>
          <p className="text-muted-foreground">
            Manage and track trade confirmations with counterparties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-2" onClick={handleBulkSend}>
            <Send className="w-4 h-4 mr-2" />
            Send All Pending
          </Button>
          <Button variant="outline" className="border-2" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Confirmations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
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
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
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
                <p className="text-sm text-muted-foreground">Disputed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.disputed}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                  placeholder="Search by reference, counterparty..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
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
                  <SelectItem value="fx">FX</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmations Table */}
      <Card className="border-2">
        <CardHeader className="border-b-2 border-border">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Confirmations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="border-2 border-border font-semibold">Confirmation ID</TableHead>
                <TableHead className="border-2 border-border font-semibold">Deal Reference</TableHead>
                <TableHead className="border-2 border-border font-semibold">Type</TableHead>
                <TableHead className="border-2 border-border font-semibold">Counterparty</TableHead>
                <TableHead className="border-2 border-border font-semibold">Trade Date</TableHead>
                <TableHead className="border-2 border-border font-semibold">Value Date</TableHead>
                <TableHead className="border-2 border-border font-semibold text-right">Amount</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConfirmations.map((conf) => (
                <TableRow key={conf.id}>
                  <TableCell className="border-2 border-border font-medium font-mono">
                    {conf.id}
                  </TableCell>
                  <TableCell className="border-2 border-border font-mono text-sm">
                    {conf.dealRef}
                  </TableCell>
                  <TableCell className="border-2 border-border">{conf.type}</TableCell>
                  <TableCell className="border-2 border-border">{conf.counterparty}</TableCell>
                  <TableCell className="border-2 border-border">{formatDate(conf.tradeDate)}</TableCell>
                  <TableCell className="border-2 border-border">{formatDate(conf.valueDate)}</TableCell>
                  <TableCell className="border-2 border-border text-right font-mono">
                    {formatCurrency(conf.buyAmount, conf.buyCurrency)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    {getStatusBadge(conf.status)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                        onClick={() => handleViewDetail(conf)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      {conf.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                          onClick={() => handleSendConfirmation(conf)}
                          title="Send Confirmation"
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
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Confirmation Details
            </DialogTitle>
          </DialogHeader>
          {selectedConfirmation && (
            <>
              <div className="px-6 py-5 space-y-5 max-h-[calc(80vh-10rem)] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Confirmation ID</Label>
                    <p className="font-semibold font-mono">{selectedConfirmation.id}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Deal Reference</Label>
                    <p className="font-semibold font-mono">{selectedConfirmation.dealRef}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div>{getStatusBadge(selectedConfirmation.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <p className="font-semibold">{selectedConfirmation.type}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Counterparty</Label>
                    <p className="font-semibold">{selectedConfirmation.counterparty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Trade Date</Label>
                    <p className="font-semibold">{formatDate(selectedConfirmation.tradeDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Value Date</Label>
                    <p className="font-semibold">{formatDate(selectedConfirmation.valueDate)}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm font-semibold mb-3">Trade Details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Buy</Label>
                      <p className="font-semibold font-mono">{formatCurrency(selectedConfirmation.buyAmount, selectedConfirmation.buyCurrency)}</p>
                    </div>
                    {selectedConfirmation.sellAmount && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Sell</Label>
                        <p className="font-semibold font-mono">{formatCurrency(selectedConfirmation.sellAmount, selectedConfirmation.sellCurrency)}</p>
                      </div>
                    )}
                    {selectedConfirmation.rate && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Rate</Label>
                        <p className="font-semibold font-mono">{selectedConfirmation.rate}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Our Reference</Label>
                    <p className="font-semibold font-mono">{selectedConfirmation.ourReference}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Their Reference</Label>
                    <p className="font-semibold font-mono">{selectedConfirmation.theirReference || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Sent Date</Label>
                    <p className="font-semibold">{formatDate(selectedConfirmation.sentDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Confirmed Date</Label>
                    <p className="font-semibold">{formatDate(selectedConfirmation.confirmedDate)}</p>
                  </div>
                </div>

                {selectedConfirmation.disputeReason && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Dispute Reason</p>
                    <p className="text-sm">{selectedConfirmation.disputeReason}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="border-t border-border px-6 py-4 gap-3">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="px-6">
                  Close
                </Button>
                <Button variant="outline" className="px-4">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                {selectedConfirmation.status === "pending" && (
                  <Button onClick={() => {
                    setShowDetailModal(false);
                    handleSendConfirmation(selectedConfirmation);
                  }} className="px-6">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-md border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Send className="w-5 h-5 text-primary" />
              Send Confirmation
            </DialogTitle>
          </DialogHeader>
          {selectedConfirmation && (
            <>
              <div className="px-6 py-5 space-y-5">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="font-semibold">{selectedConfirmation.id}</p>
                  <p className="text-sm text-muted-foreground">{selectedConfirmation.type} - {selectedConfirmation.counterparty}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Send To</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedConfirmation.counterpartyContact}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Additional Notes</Label>
                  <Textarea
                    placeholder="Add any notes to include with the confirmation..."
                    className="min-h-[80px] border border-input bg-background"
                  />
                </div>
              </div>
              <DialogFooter className="border-t border-border px-6 py-4 gap-3">
                <Button variant="outline" onClick={() => setShowSendModal(false)} className="px-6">
                  Cancel
                </Button>
                <Button onClick={handleSend} className="px-6">
                  <Send className="w-4 h-4 mr-2" />
                  Send Confirmation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
