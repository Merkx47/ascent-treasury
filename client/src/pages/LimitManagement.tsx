import { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  Filter,
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";

// Limit data
const tradingLimits = [
  { id: "LMT-001", name: "FX Open Position", category: "Market Risk", limit: 50000000, utilized: 35000000, currency: "USD", unit: "", approvedBy: "ALCO", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-002", name: "Interest Rate Risk (PV01)", category: "Market Risk", limit: 2000000, utilized: 1450000, currency: "USD", unit: "", approvedBy: "ALCO", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-003", name: "Single Counterparty", category: "Credit Risk", limit: 10000000, utilized: 7500000, currency: "USD", unit: "", approvedBy: "Credit Committee", approvedDate: "2026-01-01", expiryDate: "2026-06-30" },
  { id: "LMT-004", name: "Sector Concentration", category: "Credit Risk", limit: 30, utilized: 22, currency: "", unit: "%", approvedBy: "Credit Committee", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-005", name: "Duration Gap", category: "Market Risk", limit: 5, utilized: 3.2, currency: "", unit: "years", approvedBy: "ALCO", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-006", name: "Daily Trading Loss", category: "Market Risk", limit: 500000, utilized: 125000, currency: "USD", unit: "", approvedBy: "ALCO", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-007", name: "Overnight Money Market", category: "Liquidity", limit: 20000000, utilized: 12000000, currency: "USD", unit: "", approvedBy: "ALCO", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
  { id: "LMT-008", name: "Sovereign Exposure", category: "Credit Risk", limit: 100000000, utilized: 75000000, currency: "USD", unit: "", approvedBy: "Board", approvedDate: "2026-01-01", expiryDate: "2026-12-31" },
];

const breachHistory = [
  { id: "BRH-001", date: "2026-01-14", limitName: "FX Open Position", breachAmount: 2500000, duration: "2 hours", status: "resolved", resolution: "Position squared off", resolvedBy: "John Adebayo" },
  { id: "BRH-002", date: "2026-01-10", limitName: "Single Counterparty", breachAmount: 0, duration: "4 hours", status: "resolved", resolution: "Exposure reduced", resolvedBy: "Sarah Okonkwo" },
  { id: "BRH-003", date: "2026-01-05", limitName: "Daily Trading Loss", breachAmount: 75000, duration: "End of Day", status: "escalated", resolution: "Reported to ALCO", resolvedBy: "Risk Committee" },
];

const formatCurrency = (value: number, currency: string = "USD") => {
  if (!currency) {
    return value.toFixed(1);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatValue = (value: number, currency: string, unit: string) => {
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "years") return `${value.toFixed(1)} yrs`;
  return formatCurrency(value, currency);
};

export default function LimitManagement() {
  const { toast } = useToast();
  const { addToQueue } = useCheckerQueue();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<typeof tradingLimits[0] | null>(null);

  const [requestForm, setRequestForm] = useState({
    limitId: "",
    newLimit: "",
    justification: "",
    effectiveDate: "",
    expiryDate: "",
  });

  // Filter limits
  const filteredLimits = useMemo(() => {
    return tradingLimits.filter(limit => {
      if (searchTerm && !limit.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== "all" && limit.category !== categoryFilter) {
        return false;
      }
      const utilPercent = (limit.utilized / limit.limit) * 100;
      if (statusFilter === "critical" && utilPercent < 90) return false;
      if (statusFilter === "warning" && (utilPercent < 75 || utilPercent >= 90)) return false;
      if (statusFilter === "normal" && utilPercent >= 75) return false;
      return true;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const critical = tradingLimits.filter(l => (l.utilized / l.limit) >= 0.9).length;
    const warning = tradingLimits.filter(l => {
      const util = l.utilized / l.limit;
      return util >= 0.75 && util < 0.9;
    }).length;
    const normal = tradingLimits.filter(l => (l.utilized / l.limit) < 0.75).length;
    return { critical, warning, normal, total: tradingLimits.length };
  }, []);

  const getUtilizationStatus = (utilized: number, limit: number) => {
    const ratio = utilized / limit;
    if (ratio >= 0.9) return { label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    if (ratio >= 0.75) return { label: "Warning", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { label: "Normal", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  };

  const handleViewDetail = (limit: typeof tradingLimits[0]) => {
    setSelectedLimit(limit);
    setShowDetailModal(true);
  };

  const handleRequestChange = (limit: typeof tradingLimits[0]) => {
    setSelectedLimit(limit);
    setRequestForm({
      limitId: limit.id,
      newLimit: "",
      justification: "",
      effectiveDate: new Date().toISOString().split("T")[0],
      expiryDate: limit.expiryDate,
    });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    if (!requestForm.newLimit || !requestForm.justification) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addToQueue({
      referenceNumber: `LCR-${Date.now()}`,
      entityType: "LIMIT_CHANGE",
      entityId: selectedLimit?.id || "",
      action: "update",
      description: `Limit change request for ${selectedLimit?.name}`,
      customerName: selectedLimit?.name || "",
      amount: requestForm.newLimit,
      currency: selectedLimit?.currency || "USD",
      priority: "high",
      makerId: "user-001",
      makerName: "Current User",
      makerDepartment: "Treasury Risk",
      makerComments: requestForm.justification,
      checkerId: null,
      checkerName: null,
      checkerComments: null,
      checkedAt: null,
    });

    toast({
      title: "Request Submitted",
      description: "Limit change request has been submitted for approval",
    });

    setShowRequestModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Limit Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage trading limits across all risk categories
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Limits</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.warning}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Normal</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.normal}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="limits" className="space-y-4">
        <TabsList className="border-2">
          <TabsTrigger value="limits">Active Limits</TabsTrigger>
          <TabsTrigger value="breaches">Breach History</TabsTrigger>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
        </TabsList>

        {/* Active Limits Tab */}
        <TabsContent value="limits" className="space-y-4">
          {/* Filters */}
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search limits..."
                      className="pl-10 h-10 border border-input bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-10 border border-input bg-background">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Market Risk">Market Risk</SelectItem>
                      <SelectItem value="Credit Risk">Credit Risk</SelectItem>
                      <SelectItem value="Liquidity">Liquidity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 border border-input bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limits Table */}
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Trading Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Limit Name</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Category</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Approved Limit</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Utilized</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Available</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Utilization</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLimits.map((limit) => {
                    const utilPercent = (limit.utilized / limit.limit) * 100;
                    const available = limit.limit - limit.utilized;
                    const status = getUtilizationStatus(limit.utilized, limit.limit);

                    return (
                      <TableRow key={limit.id}>
                        <TableCell className="border-2 border-border font-medium">{limit.name}</TableCell>
                        <TableCell className="border-2 border-border">
                          <Badge variant="outline" className="border">{limit.category}</Badge>
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono">
                          {formatValue(limit.limit, limit.currency, limit.unit)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono">
                          {formatValue(limit.utilized, limit.currency, limit.unit)}
                        </TableCell>
                        <TableCell className="border-2 border-border text-right font-mono text-green-600 dark:text-green-400">
                          {formatValue(available, limit.currency, limit.unit)}
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
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                              onClick={() => handleViewDetail(limit)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                              onClick={() => handleRequestChange(limit)}
                              title="Request Change"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breach History Tab */}
        <TabsContent value="breaches" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Breach History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Date</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Limit Type</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Breach Amount</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Duration</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Resolution</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Resolved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breachHistory.map((breach) => (
                    <TableRow key={breach.id}>
                      <TableCell className="border-2 border-border">{breach.date}</TableCell>
                      <TableCell className="border-2 border-border font-medium">{breach.limitName}</TableCell>
                      <TableCell className="border-2 border-border text-right font-mono text-red-600 dark:text-red-400">
                        {breach.breachAmount > 0 ? `+${formatCurrency(breach.breachAmount)}` : "Warning Only"}
                      </TableCell>
                      <TableCell className="border-2 border-border">{breach.duration}</TableCell>
                      <TableCell className="border-2 border-border text-center">
                        <Badge
                          className={`border ${
                            breach.status === "resolved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                          style={{ borderWidth: "1px" }}
                        >
                          {breach.status === "resolved" ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {breach.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="border-2 border-border">{breach.resolution}</TableCell>
                      <TableCell className="border-2 border-border">{breach.resolvedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Pending Requests</p>
                <p className="text-sm">All limit change requests have been processed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Limit Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-lg">Limit Details</DialogTitle>
          </DialogHeader>
          {selectedLimit && (
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Limit Name</Label>
                  <p className="font-semibold">{selectedLimit.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <Badge variant="outline" className="border">{selectedLimit.category}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Approved Limit</Label>
                  <p className="font-semibold font-mono">{formatValue(selectedLimit.limit, selectedLimit.currency, selectedLimit.unit)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Utilized</Label>
                  <p className="font-semibold font-mono">{formatValue(selectedLimit.utilized, selectedLimit.currency, selectedLimit.unit)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Available</Label>
                  <p className="font-semibold font-mono text-green-600 dark:text-green-400">
                    {formatValue(selectedLimit.limit - selectedLimit.utilized, selectedLimit.currency, selectedLimit.unit)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Utilization</Label>
                <Progress value={(selectedLimit.utilized / selectedLimit.limit) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground text-right">
                  {((selectedLimit.utilized / selectedLimit.limit) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Approved By</Label>
                  <p className="font-medium">{selectedLimit.approvedBy}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                  <p className="font-medium">{selectedLimit.expiryDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t border-border px-6 py-4 gap-3">
            <Button variant="outline" onClick={() => setShowDetailModal(false)} className="px-6">
              Close
            </Button>
            <Button onClick={() => {
              setShowDetailModal(false);
              if (selectedLimit) handleRequestChange(selectedLimit);
            }} className="px-6">
              Request Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Change Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-lg border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-lg">Request Limit Change</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5 max-h-[calc(80vh-10rem)] overflow-y-auto">
            {selectedLimit && (
              <>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="font-semibold">{selectedLimit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current Limit: {formatValue(selectedLimit.limit, selectedLimit.currency, selectedLimit.unit)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">New Limit *</Label>
                  <Input
                    type="number"
                    placeholder="Enter new limit"
                    value={requestForm.newLimit}
                    onChange={(e) => setRequestForm({ ...requestForm, newLimit: e.target.value })}
                    className="h-10 border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Justification *</Label>
                  <Textarea
                    placeholder="Provide business justification for this limit change..."
                    value={requestForm.justification}
                    onChange={(e) => setRequestForm({ ...requestForm, justification: e.target.value })}
                    className="min-h-[100px] border border-input bg-background"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Effective Date</Label>
                    <Input
                      type="date"
                      value={requestForm.effectiveDate}
                      onChange={(e) => setRequestForm({ ...requestForm, effectiveDate: e.target.value })}
                      className="h-10 border border-input bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Expiry Date</Label>
                    <Input
                      type="date"
                      value={requestForm.expiryDate}
                      onChange={(e) => setRequestForm({ ...requestForm, expiryDate: e.target.value })}
                      className="h-10 border border-input bg-background"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="border-t border-border px-6 py-4 gap-3">
            <Button variant="outline" onClick={() => setShowRequestModal(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} className="px-6">
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
