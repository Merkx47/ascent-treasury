import { useState, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  AlertTriangle,
  FileText,
  Ship,
  Repeat,
  ArrowDownToLine,
  ArrowUpFromLine,
  Timer,
  TrendingUp,
} from "lucide-react";
import { ApprovalModal } from "@/components/ApprovalModal";
import { type MockCheckerQueueItem } from "@/lib/mockData";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";

const productIcons: Record<string, any> = {
  FORMM: FileText,
  FORMA: FileText,
  FORMNXP: FileText,
  PAAR: FileText,
  IMPORTLC: Ship,
  BFC: FileText,
  SHIPPINGDOC: FileText,
  FXSALES: Repeat,
  LOAN: FileText,
  INWCP: ArrowDownToLine,
  DOMOUTAC: ArrowUpFromLine,
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

export default function CheckerQueue() {
  const { toast } = useToast();
  const { queueItems, updateQueueItem } = useCheckerQueue();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MockCheckerQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.makerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
      const matchesTab = activeTab === "all" || item.entityType === activeTab;

      return matchesSearch && matchesStatus && matchesPriority && matchesTab;
    });
  }, [queueItems, searchQuery, statusFilter, priorityFilter, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage);
  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    pending: queueItems.filter((i) => i.status === "pending").length,
    approvedToday: queueItems.filter(
      (i) => i.status === "approved" && i.checkedAt && new Date(i.checkedAt).toDateString() === new Date().toDateString()
    ).length,
    rejectedToday: queueItems.filter(
      (i) => i.status === "rejected" && i.checkedAt && new Date(i.checkedAt).toDateString() === new Date().toDateString()
    ).length,
    avgTime: "2.5 hrs",
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: any }> = {
      pending: { className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
      approved: { className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
      rejected: { className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
      sent_back: { className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: RotateCcw },
    };

    const { className, icon: Icon } = config[status] || config.pending;

    return (
      <Badge variant="secondary" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, string> = {
      normal: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      high: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <Badge variant="outline" className={config[priority] || config.normal}>
        {priority === "urgent" && <AlertTriangle className="w-3 h-3 mr-1" />}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    if (currency === "NGN") {
      return `₦${num.toLocaleString()}`;
    }
    return `${currency} ${num.toLocaleString()}`;
  };

  const handleOpenModal = (item: MockCheckerQueueItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAction = (action: "approve" | "reject" | "send_back", comments: string) => {
    if (!selectedItem) return;

    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "sent_back";

    updateQueueItem(selectedItem.id, {
      status: newStatus,
      checkedAt: new Date(),
      checkerComments: comments,
    });

    const actionLabels = {
      approve: "Approved",
      reject: "Rejected",
      send_back: "Sent Back",
    };

    toast({
      title: `Item ${actionLabels[action]}`,
      description: `${selectedItem.referenceNumber} has been ${actionLabels[action].toLowerCase()}`,
      variant: action === "reject" ? "destructive" : "default",
    });

    setIsModalOpen(false);
  };

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: queueItems.filter((i) => i.status === "pending").length };
    Object.keys(productLabels).forEach((type) => {
      counts[type] = queueItems.filter((i) => i.entityType === type && i.status === "pending").length;
    });
    return counts;
  }, [queueItems]);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Checker Queue</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Checker Queue</h1>
            <p className="text-sm text-muted-foreground">
              Review and approve pending transactions across all modules
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-2 text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {stats.pending} Pending
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedToday}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejectedToday}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                <p className="text-2xl font-bold">{stats.avgTime}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Timer className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference, customer, or maker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] border-2 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="sent_back">Sent Back</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[160px] border-2 border-border">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Queue Table with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="relative">
            All
            {tabCounts.all > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="FORMM">
            Form M
            {tabCounts.FORMM > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.FORMM}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="FORMA">
            Form A
            {tabCounts.FORMA > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.FORMA}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="IMPORTLC">
            Import LC
            {tabCounts.IMPORTLC > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.IMPORTLC}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="FXSALES">
            FX Trades
            {tabCounts.FXSALES > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.FXSALES}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="INWCP">
            Payments
            {(tabCounts.INWCP || 0) + (tabCounts.DOMOUTAC || 0) > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {(tabCounts.INWCP || 0) + (tabCounts.DOMOUTAC || 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <Card className="border-2 border-gray-300 dark:border-gray-600 overflow-hidden rounded-lg">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px] border-2 border-gray-300 dark:border-gray-600 font-semibold">Reference</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Customer</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Amount</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Maker</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Submitted</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Priority</TableHead>
                <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Status</TableHead>
                <TableHead className="text-right border-2 border-gray-300 dark:border-gray-600 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQueue.map((item) => {
                const Icon = productIcons[item.entityType] || FileText;
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium">{item.referenceNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {productLabels[item.entityType]}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <p className="text-sm font-medium truncate max-w-[200px]">{item.customerName}</p>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <p className="font-mono text-sm">{formatAmount(item.amount, item.currency)}</p>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <div>
                        <p className="text-sm">{item.makerName}</p>
                        <p className="text-xs text-muted-foreground">{item.makerDepartment}</p>
                      </div>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <p className="text-sm">{formatDistanceToNow(item.submittedAt, { addSuffix: true })}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(item.submittedAt, "dd MMM HH:mm")}
                      </p>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right border-2 border-gray-300 dark:border-gray-600">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-border hover:bg-muted"
                          onClick={() => handleOpenModal(item)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsModalOpen(true);
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsModalOpen(true);
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedQueue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground border-2 border-gray-300 dark:border-gray-600">
                    No items found in the queue.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {filteredQueue.length > itemsPerPage && (
            <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredQueue.length)} of {filteredQueue.length} items
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className={currentPage !== pageNum ? "border-2" : ""}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Tabs>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onAction={handleAction}
      />
    </div>
  );
}
