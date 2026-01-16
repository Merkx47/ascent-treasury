import { useState, useMemo } from "react";
import {
  Landmark,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  XCircle,
  Eye,
  Upload,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
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
import { useToast } from "@/hooks/use-toast";

// Accounting entries data
const accountingEntries = [
  {
    id: "ACC-2026-00001",
    dealRef: "FX-2026-001234",
    entryDate: "2026-01-15",
    valueDate: "2026-01-17",
    type: "FX Spot",
    description: "FX Spot USD/NGN - Access Bank",
    entries: [
      { account: "1001-NOSTRO-USD", accountName: "USD Nostro Account", debit: 5000000, credit: 0, currency: "USD" },
      { account: "2001-CUSTOMER-ACC", accountName: "Customer Account", debit: 0, credit: 7850000000, currency: "NGN" },
      { account: "4001-FX-INCOME", accountName: "FX Trading Income", debit: 0, credit: 25000000, currency: "NGN" },
      { account: "1002-NOSTRO-NGN", accountName: "NGN Settlement Account", debit: 7875000000, credit: 0, currency: "NGN" },
    ],
    status: "posted",
    postedBy: "System",
    postedAt: "2026-01-15 14:30:00",
  },
  {
    id: "ACC-2026-00002",
    dealRef: "MM-2026-000456",
    entryDate: "2026-01-14",
    valueDate: "2026-01-14",
    type: "Deposit Placement",
    description: "Interbank Deposit - Zenith Bank - 30 Days",
    entries: [
      { account: "2101-MM-PLACEMENT", accountName: "Money Market Placements", debit: 10000000000, credit: 0, currency: "NGN" },
      { account: "1002-NOSTRO-NGN", accountName: "NGN Settlement Account", debit: 0, credit: 10000000000, currency: "NGN" },
    ],
    status: "posted",
    postedBy: "System",
    postedAt: "2026-01-14 10:15:00",
  },
  {
    id: "ACC-2026-00003",
    dealRef: "BOND-2026-078",
    entryDate: "2026-01-12",
    valueDate: "2026-01-14",
    type: "Bond Purchase",
    description: "FGN Bond 14.50% 2034 Purchase",
    entries: [
      { account: "3001-BOND-HTM", accountName: "Bonds Held to Maturity", debit: 500000000, credit: 0, currency: "NGN" },
      { account: "3002-BOND-PREMIUM", accountName: "Bond Premium", debit: 5000000, credit: 0, currency: "NGN" },
      { account: "1002-NOSTRO-NGN", accountName: "NGN Settlement Account", debit: 0, credit: 505000000, currency: "NGN" },
    ],
    status: "pending",
    postedBy: null,
    postedAt: null,
  },
  {
    id: "ACC-2026-00004",
    dealRef: "MM-2026-000460",
    entryDate: "2026-01-14",
    valueDate: "2026-01-14",
    type: "Interest Accrual",
    description: "Daily Interest Accrual - MM Portfolio",
    entries: [
      { account: "2102-ACCRUED-INT", accountName: "Accrued Interest Receivable", debit: 45000000, credit: 0, currency: "NGN" },
      { account: "4101-INT-INCOME", accountName: "Interest Income - Money Market", debit: 0, credit: 45000000, currency: "NGN" },
    ],
    status: "posted",
    postedBy: "System",
    postedAt: "2026-01-14 23:59:00",
  },
  {
    id: "ACC-2026-00005",
    dealRef: "FX-2026-001235",
    entryDate: "2026-01-13",
    valueDate: "2026-02-13",
    type: "FX Forward",
    description: "Forward Contract EUR/NGN - GTBank",
    entries: [
      { account: "1501-FX-FORWARD", accountName: "FX Forward Receivables", debit: 3400000000, credit: 0, currency: "NGN" },
      { account: "2501-FX-FORWARD", accountName: "FX Forward Payables", debit: 0, credit: 3400000000, currency: "NGN" },
    ],
    status: "failed",
    postedBy: null,
    postedAt: null,
    errorMessage: "GL Account 1501-FX-FORWARD not found in Core Banking",
  },
];

// GL Summary data
const glSummary = [
  { category: "FX Trading", debitTotal: 15700000000, creditTotal: 15650000000, net: 50000000, currency: "NGN" },
  { category: "Money Market", debitTotal: 25045000000, creditTotal: 25000000000, net: 45000000, currency: "NGN" },
  { category: "Fixed Income", debitTotal: 505000000, creditTotal: 505000000, net: 0, currency: "NGN" },
  { category: "Interest Accruals", debitTotal: 45000000, creditTotal: 45000000, net: 0, currency: "NGN" },
];

// Hierarchical GL Chart of Accounts
interface GLAccount {
  code: string;
  name: string;
  type: "category" | "group" | "account";
  balance: number;
  currency: string;
  children?: GLAccount[];
}

const chartOfAccounts: GLAccount[] = [
  {
    code: "1000",
    name: "Assets",
    type: "category",
    balance: 125500000000,
    currency: "NGN",
    children: [
      {
        code: "1001",
        name: "Nostro Accounts",
        type: "group",
        balance: 45000000000,
        currency: "NGN",
        children: [
          { code: "1001-001", name: "USD Nostro - Citibank", type: "account", balance: 25000000000, currency: "NGN" },
          { code: "1001-002", name: "EUR Nostro - Deutsche Bank", type: "account", balance: 8500000000, currency: "NGN" },
          { code: "1001-003", name: "GBP Nostro - Barclays", type: "account", balance: 6500000000, currency: "NGN" },
          { code: "1001-004", name: "NGN Settlement Account", type: "account", balance: 5000000000, currency: "NGN" },
        ],
      },
      {
        code: "1002",
        name: "FX Forward Receivables",
        type: "group",
        balance: 15000000000,
        currency: "NGN",
        children: [
          { code: "1002-001", name: "FX Forward - USD", type: "account", balance: 10000000000, currency: "NGN" },
          { code: "1002-002", name: "FX Forward - EUR", type: "account", balance: 3500000000, currency: "NGN" },
          { code: "1002-003", name: "FX Forward - GBP", type: "account", balance: 1500000000, currency: "NGN" },
        ],
      },
      {
        code: "1003",
        name: "Money Market Placements",
        type: "group",
        balance: 35000000000,
        currency: "NGN",
        children: [
          { code: "1003-001", name: "Interbank Placements - Call", type: "account", balance: 12000000000, currency: "NGN" },
          { code: "1003-002", name: "Interbank Placements - Term", type: "account", balance: 18000000000, currency: "NGN" },
          { code: "1003-003", name: "Treasury Bills", type: "account", balance: 5000000000, currency: "NGN" },
        ],
      },
      {
        code: "1004",
        name: "Fixed Income Securities",
        type: "group",
        balance: 28000000000,
        currency: "NGN",
        children: [
          { code: "1004-001", name: "FGN Bonds - HTM", type: "account", balance: 15000000000, currency: "NGN" },
          { code: "1004-002", name: "FGN Bonds - AFS", type: "account", balance: 8000000000, currency: "NGN" },
          { code: "1004-003", name: "Corporate Bonds", type: "account", balance: 3500000000, currency: "NGN" },
          { code: "1004-004", name: "Bond Premium/Discount", type: "account", balance: 1500000000, currency: "NGN" },
        ],
      },
      {
        code: "1005",
        name: "Accrued Interest Receivable",
        type: "group",
        balance: 2500000000,
        currency: "NGN",
        children: [
          { code: "1005-001", name: "Accrued Int - Money Market", type: "account", balance: 850000000, currency: "NGN" },
          { code: "1005-002", name: "Accrued Int - Fixed Income", type: "account", balance: 1200000000, currency: "NGN" },
          { code: "1005-003", name: "Accrued Int - Placements", type: "account", balance: 450000000, currency: "NGN" },
        ],
      },
    ],
  },
  {
    code: "2000",
    name: "Liabilities",
    type: "category",
    balance: 85000000000,
    currency: "NGN",
    children: [
      {
        code: "2001",
        name: "FX Forward Payables",
        type: "group",
        balance: 14500000000,
        currency: "NGN",
        children: [
          { code: "2001-001", name: "FX Forward Payable - USD", type: "account", balance: 9500000000, currency: "NGN" },
          { code: "2001-002", name: "FX Forward Payable - EUR", type: "account", balance: 3200000000, currency: "NGN" },
          { code: "2001-003", name: "FX Forward Payable - GBP", type: "account", balance: 1800000000, currency: "NGN" },
        ],
      },
      {
        code: "2002",
        name: "Money Market Borrowings",
        type: "group",
        balance: 45000000000,
        currency: "NGN",
        children: [
          { code: "2002-001", name: "Call Borrowings", type: "account", balance: 15000000000, currency: "NGN" },
          { code: "2002-002", name: "Term Borrowings", type: "account", balance: 25000000000, currency: "NGN" },
          { code: "2002-003", name: "Repos", type: "account", balance: 5000000000, currency: "NGN" },
        ],
      },
      {
        code: "2003",
        name: "Customer FX Deposits",
        type: "group",
        balance: 22500000000,
        currency: "NGN",
        children: [
          { code: "2003-001", name: "Customer Deposits - USD", type: "account", balance: 12000000000, currency: "NGN" },
          { code: "2003-002", name: "Customer Deposits - EUR", type: "account", balance: 6500000000, currency: "NGN" },
          { code: "2003-003", name: "Customer Deposits - GBP", type: "account", balance: 4000000000, currency: "NGN" },
        ],
      },
      {
        code: "2004",
        name: "Accrued Interest Payable",
        type: "group",
        balance: 3000000000,
        currency: "NGN",
        children: [
          { code: "2004-001", name: "Accrued Int - Borrowings", type: "account", balance: 1800000000, currency: "NGN" },
          { code: "2004-002", name: "Accrued Int - Repos", type: "account", balance: 450000000, currency: "NGN" },
          { code: "2004-003", name: "Accrued Int - Customer", type: "account", balance: 750000000, currency: "NGN" },
        ],
      },
    ],
  },
  {
    code: "4000",
    name: "Income",
    type: "category",
    balance: 2850000000,
    currency: "NGN",
    children: [
      {
        code: "4001",
        name: "FX Trading Income",
        type: "group",
        balance: 1250000000,
        currency: "NGN",
        children: [
          { code: "4001-001", name: "FX Spot Trading Income", type: "account", balance: 750000000, currency: "NGN" },
          { code: "4001-002", name: "FX Forward Income", type: "account", balance: 350000000, currency: "NGN" },
          { code: "4001-003", name: "FX Revaluation Gain", type: "account", balance: 150000000, currency: "NGN" },
        ],
      },
      {
        code: "4002",
        name: "Interest Income",
        type: "group",
        balance: 1350000000,
        currency: "NGN",
        children: [
          { code: "4002-001", name: "Int Income - Money Market", type: "account", balance: 450000000, currency: "NGN" },
          { code: "4002-002", name: "Int Income - Fixed Income", type: "account", balance: 650000000, currency: "NGN" },
          { code: "4002-003", name: "Int Income - Placements", type: "account", balance: 250000000, currency: "NGN" },
        ],
      },
      {
        code: "4003",
        name: "Fee Income",
        type: "group",
        balance: 250000000,
        currency: "NGN",
        children: [
          { code: "4003-001", name: "Commission on FX", type: "account", balance: 150000000, currency: "NGN" },
          { code: "4003-002", name: "Trade Execution Fees", type: "account", balance: 100000000, currency: "NGN" },
        ],
      },
    ],
  },
  {
    code: "5000",
    name: "Expenses",
    type: "category",
    balance: 850000000,
    currency: "NGN",
    children: [
      {
        code: "5001",
        name: "Interest Expense",
        type: "group",
        balance: 650000000,
        currency: "NGN",
        children: [
          { code: "5001-001", name: "Int Expense - Borrowings", type: "account", balance: 450000000, currency: "NGN" },
          { code: "5001-002", name: "Int Expense - Repos", type: "account", balance: 120000000, currency: "NGN" },
          { code: "5001-003", name: "Int Expense - Customer", type: "account", balance: 80000000, currency: "NGN" },
        ],
      },
      {
        code: "5002",
        name: "Trading Losses",
        type: "group",
        balance: 200000000,
        currency: "NGN",
        children: [
          { code: "5002-001", name: "FX Revaluation Loss", type: "account", balance: 125000000, currency: "NGN" },
          { code: "5002-002", name: "Bond MTM Loss", type: "account", balance: 75000000, currency: "NGN" },
        ],
      },
    ],
  },
];

const formatCurrency = (value: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
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
    posted: {
      label: "Posted",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle2,
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle,
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

// GL Tree Item Component
function GLTreeItem({
  account,
  level = 0,
  expandedNodes,
  toggleNode
}: {
  account: GLAccount;
  level?: number;
  expandedNodes: Set<string>;
  toggleNode: (code: string) => void;
}) {
  const hasChildren = account.children && account.children.length > 0;
  const isExpanded = expandedNodes.has(account.code);
  const indent = level * 24;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "category":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "group":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <TableRow
        className={`${account.type === "category" ? "bg-muted/30 font-semibold" : ""} hover:bg-muted/50 cursor-pointer`}
        onClick={() => hasChildren && toggleNode(account.code)}
      >
        <TableCell className="border-2 border-border" style={{ paddingLeft: `${indent + 16}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )
            ) : (
              <span className="w-4" />
            )}
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-500" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500" />
              )
            ) : (
              <FileText className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-mono text-sm">{account.code}</span>
          </div>
        </TableCell>
        <TableCell className="border-2 border-border">
          <span className={account.type === "category" ? "font-bold" : account.type === "group" ? "font-semibold" : ""}>
            {account.name}
          </span>
        </TableCell>
        <TableCell className="border-2 border-border text-center">
          <Badge className={`${getTypeColor(account.type)} border text-xs`} style={{ borderWidth: "1px" }}>
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="border-2 border-border text-right font-mono">
          {formatBalance(account.balance)}
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && account.children?.map((child) => (
        <GLTreeItem
          key={child.code}
          account={child}
          level={level + 1}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      ))}
    </>
  );
}

export default function Accounting() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<typeof accountingEntries[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1000", "2000", "4000", "5000"]));

  const toggleNode = (code: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allCodes: string[] = [];
    const collectCodes = (accounts: GLAccount[]) => {
      accounts.forEach(acc => {
        if (acc.children) {
          allCodes.push(acc.code);
          collectCodes(acc.children);
        }
      });
    };
    collectCodes(chartOfAccounts);
    setExpandedNodes(new Set(allCodes));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: accountingEntries.length,
      pending: accountingEntries.filter(e => e.status === "pending").length,
      posted: accountingEntries.filter(e => e.status === "posted").length,
      failed: accountingEntries.filter(e => e.status === "failed").length,
    };
  }, []);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return accountingEntries.filter(entry => {
      if (searchTerm && !entry.dealRef.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !entry.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !entry.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && entry.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && !entry.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  // Totals
  const totals = useMemo(() => {
    return glSummary.reduce((acc, gl) => ({
      debit: acc.debit + gl.debitTotal,
      credit: acc.credit + gl.creditTotal,
      net: acc.net + gl.net,
    }), { debit: 0, credit: 0, net: 0 });
  }, []);

  const handleViewDetail = (entry: typeof accountingEntries[0]) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  const handlePostEntry = (entry: typeof accountingEntries[0]) => {
    toast({
      title: "Entry Posted",
      description: `Accounting entry ${entry.id} has been posted to Core Banking`,
    });
  };

  const handleRetryEntry = (entry: typeof accountingEntries[0]) => {
    toast({
      title: "Retry Initiated",
      description: `Retrying posting for ${entry.id}`,
    });
  };

  const handleExportToCoreBanking = () => {
    toast({
      title: "Export Started",
      description: "Exporting all pending entries to Core Banking system",
    });
  };

  const handleDownloadReport = () => {
    // Generate CSV content
    const headers = ["Entry ID", "Deal Reference", "Entry Date", "Value Date", "Type", "Description", "Status"];
    const rows = filteredEntries.map(entry => [
      entry.id,
      entry.dealRef,
      entry.entryDate,
      entry.valueDate,
      entry.type,
      entry.description,
      entry.status,
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
    link.setAttribute("download", `accounting_entries_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Downloaded",
      description: "Accounting entries report has been downloaded as CSV",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Accounting & GL Entries</h1>
          <p className="text-muted-foreground">
            Manage accounting entries and GL postings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-2" onClick={handleExportToCoreBanking}>
            <Upload className="w-4 h-4 mr-2" />
            Export to Core Banking
          </Button>
          <Button variant="outline" className="border-2" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
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
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.posted}</p>
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
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList className="border-2">
          <TabsTrigger value="entries">Accounting Entries</TabsTrigger>
          <TabsTrigger value="summary">GL Summary</TabsTrigger>
          <TabsTrigger value="coa">Chart of Accounts</TabsTrigger>
        </TabsList>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-4">
          {/* Filters */}
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by reference, description..."
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
                      <SelectItem value="posted">Posted</SelectItem>
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
                      <SelectItem value="fx">FX</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="bond">Bond</SelectItem>
                      <SelectItem value="interest">Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entries Table */}
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Accounting Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">Entry ID</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Deal Reference</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Entry Date</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Type</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Description</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="border-2 border-border font-medium font-mono">
                        {entry.id}
                      </TableCell>
                      <TableCell className="border-2 border-border font-mono text-sm">
                        {entry.dealRef}
                      </TableCell>
                      <TableCell className="border-2 border-border">{formatDate(entry.entryDate)}</TableCell>
                      <TableCell className="border-2 border-border">{entry.type}</TableCell>
                      <TableCell className="border-2 border-border text-sm max-w-[200px] truncate">
                        {entry.description}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center">
                        {getStatusBadge(entry.status)}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                            onClick={() => handleViewDetail(entry)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {entry.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                              onClick={() => handlePostEntry(entry)}
                              title="Post Entry"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          )}
                          {entry.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                              onClick={() => handleRetryEntry(entry)}
                              title="Retry"
                            >
                              <RefreshCw className="w-4 h-4" />
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
        </TabsContent>

        {/* GL Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Debits</p>
                    <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                      {formatCurrency(totals.debit)}
                    </p>
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="text-xl font-bold font-mono text-green-600 dark:text-green-400">
                      {formatCurrency(totals.credit)}
                    </p>
                  </div>
                  <ArrowDownRight className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Position</p>
                    <p className={`text-xl font-bold font-mono ${totals.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {formatCurrency(totals.net)}
                    </p>
                  </div>
                  <Calculator className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <CardTitle>Daily GL Summary by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold">GL Category</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total Debits</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Total Credits</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glSummary.map((gl, index) => (
                    <TableRow key={index}>
                      <TableCell className="border-2 border-border font-medium">{gl.category}</TableCell>
                      <TableCell className="border-2 border-border text-right font-mono">
                        {formatCurrency(gl.debitTotal)}
                      </TableCell>
                      <TableCell className="border-2 border-border text-right font-mono">
                        {formatCurrency(gl.creditTotal)}
                      </TableCell>
                      <TableCell className={`border-2 border-border text-right font-mono font-medium ${
                        gl.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {gl.net >= 0 ? "+" : ""}{formatCurrency(gl.net)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell className="border-2 border-border font-bold">Total</TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold">
                      {formatCurrency(totals.debit)}
                    </TableCell>
                    <TableCell className="border-2 border-border text-right font-mono font-bold">
                      {formatCurrency(totals.credit)}
                    </TableCell>
                    <TableCell className={`border-2 border-border text-right font-mono font-bold ${
                      totals.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {totals.net >= 0 ? "+" : ""}{formatCurrency(totals.net)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="coa" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Treasury Chart of Accounts
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-2" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" className="border-2" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-2 border-border font-semibold w-[250px]">GL Code</TableHead>
                    <TableHead className="border-2 border-border font-semibold">Account Name</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-center w-[120px]">Type</TableHead>
                    <TableHead className="border-2 border-border font-semibold text-right w-[200px]">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartOfAccounts.map((account) => (
                    <GLTreeItem
                      key={account.code}
                      account={account}
                      expandedNodes={expandedNodes}
                      toggleNode={toggleNode}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* GL Level Legend */}
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground">Legend:</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border text-xs" style={{ borderWidth: "1px" }}>
                    Category
                  </Badge>
                  <span className="text-xs text-muted-foreground">Level 1 - Main Category</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border text-xs" style={{ borderWidth: "1px" }}>
                    Group
                  </Badge>
                  <span className="text-xs text-muted-foreground">Level 2 - Account Group</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border text-xs" style={{ borderWidth: "1px" }}>
                    Account
                  </Badge>
                  <span className="text-xs text-muted-foreground">Level 3 - Individual GL Account</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl border-2 border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Landmark className="w-5 h-5 text-primary" />
              Accounting Entry Details
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <>
              <div className="px-6 py-5 space-y-5 max-h-[calc(80vh-10rem)] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Entry ID</Label>
                    <p className="font-semibold font-mono">{selectedEntry.id}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Deal Reference</Label>
                    <p className="font-semibold font-mono">{selectedEntry.dealRef}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div>{getStatusBadge(selectedEntry.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <p className="font-semibold">{selectedEntry.type}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Entry Date</Label>
                    <p className="font-semibold">{formatDate(selectedEntry.entryDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Value Date</Label>
                    <p className="font-semibold">{formatDate(selectedEntry.valueDate)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <p className="font-semibold">{selectedEntry.description}</p>
                </div>

                {/* Journal Entries Table */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Journal Entries</Label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="border border-border font-semibold">Account</TableHead>
                          <TableHead className="border border-border font-semibold">Account Name</TableHead>
                          <TableHead className="border border-border font-semibold text-right">Debit</TableHead>
                          <TableHead className="border border-border font-semibold text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEntry.entries.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell className="border border-border font-mono text-sm">{entry.account}</TableCell>
                            <TableCell className="border border-border text-sm">{entry.accountName}</TableCell>
                            <TableCell className="border border-border text-right font-mono">
                              {entry.debit > 0 ? formatCurrency(entry.debit, entry.currency) : "-"}
                            </TableCell>
                            <TableCell className="border border-border text-right font-mono">
                              {entry.credit > 0 ? formatCurrency(entry.credit, entry.currency) : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {selectedEntry.status === "posted" && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Posted By</Label>
                      <p className="font-semibold">{selectedEntry.postedBy}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Posted At</Label>
                      <p className="font-semibold">{selectedEntry.postedAt}</p>
                    </div>
                  </div>
                )}

                {selectedEntry.status === "failed" && selectedEntry.errorMessage && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Error Message</p>
                    <p className="text-sm">{selectedEntry.errorMessage}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="border-t border-border px-6 py-4 gap-3">
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="px-6">
                  Close
                </Button>
                {selectedEntry.status === "pending" && (
                  <Button onClick={() => handlePostEntry(selectedEntry)} className="px-6">
                    <Upload className="w-4 h-4 mr-2" />
                    Post Entry
                  </Button>
                )}
                {selectedEntry.status === "failed" && (
                  <Button onClick={() => handleRetryEntry(selectedEntry)} className="px-6">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
