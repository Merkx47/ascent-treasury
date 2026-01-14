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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Shield,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
  Eye,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { exportToExcel, formatComplianceIssueForExport } from "@/lib/exportUtils";

interface ComplianceItem {
  id: string;
  reference: string;
  type: string;
  customer: string;
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved" | "escalated";
  assignedTo: string;
  dueDate: Date;
  createdAt: Date;
}

const mockComplianceItems: ComplianceItem[] = [
  { id: "1", reference: "CBN-CHK-2024-0001", type: "CBN Compliance", customer: "Dangote Industries Ltd", issue: "Missing Form M documentation", severity: "critical", status: "open", assignedTo: "Chioma Okonkwo", dueDate: new Date(), createdAt: subDays(new Date(), 2) },
  { id: "2", reference: "AML-SCR-2024-0045", type: "AML Screening", customer: "Zenith Global Trading", issue: "PEP match requires verification", severity: "high", status: "in_progress", assignedTo: "Emeka Adekunle", dueDate: subDays(new Date(), -1), createdAt: subDays(new Date(), 5) },
  { id: "3", reference: "KYC-REV-2024-0112", type: "KYC Review", customer: "Niger Delta Oil & Gas", issue: "Expired beneficial owner documents", severity: "medium", status: "open", assignedTo: "Amina Mohammed", dueDate: subDays(new Date(), -3), createdAt: subDays(new Date(), 10) },
  { id: "4", reference: "SAR-FIL-2024-0008", type: "SAR Filing", customer: "Lagos Port Terminal", issue: "Suspicious transaction pattern detected", severity: "critical", status: "escalated", assignedTo: "Oluwaseun Bakare", dueDate: subDays(new Date(), -1), createdAt: subDays(new Date(), 1) },
  { id: "5", reference: "OFAC-CHK-2024-0023", type: "OFAC Check", customer: "Abuja Steel Works", issue: "Potential sanctions list match", severity: "high", status: "in_progress", assignedTo: "Fatima Yusuf", dueDate: new Date(), createdAt: subDays(new Date(), 3) },
  { id: "6", reference: "CBN-RPT-2024-0067", type: "CBN Reporting", customer: "Kano Textiles Limited", issue: "Late regulatory filing", severity: "medium", status: "resolved", assignedTo: "Ibrahim Suleiman", dueDate: subDays(new Date(), 5), createdAt: subDays(new Date(), 15) },
  { id: "7", reference: "AML-TRN-2024-0089", type: "AML Training", customer: "Internal", issue: "Staff training certification expired", severity: "low", status: "open", assignedTo: "Ngozi Eze", dueDate: subDays(new Date(), -7), createdAt: subDays(new Date(), 20) },
  { id: "8", reference: "KYC-UPD-2024-0156", type: "KYC Update", customer: "Port Harcourt Shipping", issue: "Annual KYC refresh required", severity: "medium", status: "open", assignedTo: "Adebayo Ogundimu", dueDate: subDays(new Date(), -5), createdAt: subDays(new Date(), 8) },
  { id: "9", reference: "CBN-LIC-2024-0003", type: "License Renewal", customer: "Internal", issue: "Trade finance license renewal pending", severity: "high", status: "in_progress", assignedTo: "Hauwa Aliyu", dueDate: subDays(new Date(), -14), createdAt: subDays(new Date(), 30) },
  { id: "10", reference: "AML-RPT-2024-0234", type: "AML Report", customer: "Calabar Exports Ltd", issue: "CTR filing required for large transaction", severity: "medium", status: "open", assignedTo: "Chukwuma Nwosu", dueDate: subDays(new Date(), -2), createdAt: subDays(new Date(), 4) },
  { id: "11", reference: "OFAC-REV-2024-0012", type: "OFAC Review", customer: "Enugu Mining Corp", issue: "Secondary sanctions review needed", severity: "high", status: "open", assignedTo: "Yetunde Adeyemi", dueDate: subDays(new Date(), -1), createdAt: subDays(new Date(), 2) },
  { id: "12", reference: "KYC-NEW-2024-0445", type: "KYC Onboarding", customer: "Sokoto Agriculture", issue: "New customer due diligence incomplete", severity: "medium", status: "in_progress", assignedTo: "Musa Garba", dueDate: subDays(new Date(), -4), createdAt: subDays(new Date(), 6) },
];

const severityColors = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200",
};

const statusColors = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  escalated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Compliance() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredItems = useMemo(() => {
    let result = [...mockComplianceItems];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.reference.toLowerCase().includes(searchLower) ||
          item.customer.toLowerCase().includes(searchLower) ||
          item.issue.toLowerCase().includes(searchLower)
      );
    }

    if (severityFilter !== "all") {
      result = result.filter((item) => item.severity === severityFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [search, severityFilter, statusFilter]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const stats = {
    open: mockComplianceItems.filter((i) => i.status === "open").length,
    critical: mockComplianceItems.filter((i) => i.severity === "critical").length,
    overdue: mockComplianceItems.filter((i) => i.dueDate < new Date() && i.status !== "resolved").length,
    resolved: mockComplianceItems.filter((i) => i.status === "resolved").length,
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
            <BreadcrumbPage>Compliance</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Compliance Management</h1>
            <p className="text-sm text-muted-foreground">
              Monitor regulatory compliance and AML/KYC requirements
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <FileWarning className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-border">
        <CardHeader className="pb-4 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Compliance Issues</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64 border-2 border-border"
                  data-testid="input-search-compliance"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 border-2 border-border" data-testid="select-severity-filter">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-2 border-border" data-testid="select-status-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="border-2"
                onClick={() => {
                  const exportData = filteredItems.map(item => formatComplianceIssueForExport({
                    id: item.id,
                    referenceNumber: item.reference,
                    issueType: item.type,
                    severity: item.severity,
                    status: item.status,
                    description: item.issue,
                    affectedTransaction: item.customer,
                    reportedBy: item.assignedTo,
                    reportedDate: format(item.createdAt, "yyyy-MM-dd"),
                    resolvedDate: item.status === "resolved" ? format(item.dueDate, "yyyy-MM-dd") : "",
                  }));
                  exportToExcel(exportData, "Compliance_Issues_Export");
                }}
                data-testid="button-download-xlsx"
              >
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
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Reference</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Type</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Customer</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Issue</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Severity</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Status</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Due Date</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground border-2 border-border">
                      No compliance issues found
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-compliance-${item.id}`}>
                      <td className="font-mono text-sm font-medium px-4 py-3 border-2 border-border text-primary">
                        {item.reference}
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge variant="outline" className="border-2">{item.type}</Badge>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="max-w-[160px] truncate text-sm">{item.customer}</div>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="max-w-[200px] truncate text-sm">{item.issue}</div>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge className={`capitalize ${severityColors[item.severity]}`}>
                          {item.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Badge className={`capitalize ${statusColors[item.status]}`}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="text-sm px-4 py-3 border-2 border-border">
                        <span className={item.dueDate < new Date() && item.status !== "resolved" ? "text-red-600 font-medium" : ""}>
                          {format(item.dueDate, "dd MMM yyyy")}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <Button variant="ghost" size="icon" data-testid={`button-view-${item.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length} results
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
