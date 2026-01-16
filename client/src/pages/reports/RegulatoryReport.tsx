import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { generateRegulatoryReport } from "@/lib/report-generator";
import { format } from "date-fns";
import { ReportBuilderModal } from "@/components/ReportBuilderModal";

// Treasury regulatory and risk reports
const regulatoryReports = [
  {
    id: "RPT_VAR_DAILY",
    name: "RPT_VAR_DAILY",
    description: "Daily Value at Risk (VaR) report",
    category: "MARKET RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 16, 10, 45, 46),
  },
  {
    id: "RPT_TRADING_LIMIT_UTILIZATION",
    name: "RPT_TRADING_LIMIT_UTILIZATION",
    description: "Trading limit utilization and breaches",
    category: "LIMIT MONITORING",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 16, 10, 45, 46),
  },
  {
    id: "RPT_STRESS_TEST_RESULTS",
    name: "RPT_STRESS_TEST_RESULTS",
    description: "Treasury portfolio stress testing results",
    category: "STRESS TESTING",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 15, 11, 3, 18),
  },
  {
    id: "RPT_FX_NOP_COMPLIANCE",
    name: "RPT_FX_NOP_COMPLIANCE",
    description: "FX net open position regulatory compliance",
    category: "CBN COMPLIANCE",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 15, 11, 3, 18),
  },
  {
    id: "RPT_COUNTERPARTY_CREDIT_EXPOSURE",
    name: "RPT_COUNTERPARTY_CREDIT_EXPOSURE",
    description: "Counterparty credit risk exposure report",
    category: "CREDIT RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 14, 11, 3, 18),
  },
  {
    id: "RPT_INTEREST_RATE_SENSITIVITY",
    name: "RPT_INTEREST_RATE_SENSITIVITY",
    description: "Interest rate risk sensitivity analysis (DV01/PV01)",
    category: "MARKET RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 14, 11, 3, 18),
  },
  {
    id: "RPT_LIQUIDITY_COVERAGE_RATIO",
    name: "RPT_LIQUIDITY_COVERAGE_RATIO",
    description: "LCR regulatory compliance report",
    category: "LIQUIDITY RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 13, 11, 3, 18),
  },
  {
    id: "RPT_NSFR_COMPLIANCE",
    name: "RPT_NSFR_COMPLIANCE",
    description: "Net Stable Funding Ratio compliance",
    category: "LIQUIDITY RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 13, 11, 3, 18),
  },
  {
    id: "RPT_MARKET_RISK_CAPITAL",
    name: "RPT_MARKET_RISK_CAPITAL",
    description: "Market risk capital charge calculation",
    category: "CAPITAL",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 12, 11, 3, 18),
  },
  {
    id: "RPT_LARGE_EXPOSURE_LIMITS",
    name: "RPT_LARGE_EXPOSURE_LIMITS",
    description: "Large exposure concentration limits",
    category: "CREDIT RISK",
    status: "ACTIVE",
    createdAt: new Date(2025, 0, 12, 11, 3, 18),
  },
];

export default function RegulatoryReport() {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 100;

  const filteredReports = [...regulatoryReports].sort((a, b) => {
    if (sortField === "createdAt") {
      return sortOrder === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime();
    }
    const aVal = (a as any)[sortField];
    const bVal = (b as any)[sortField];
    return sortOrder === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = filteredReports.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExportReport = () => {
    generateRegulatoryReport({
      period: format(new Date(), "MMMM yyyy"),
      generatedBy: "Adebayo Ogunlesi",
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
            <BreadcrumbLink href="/reports">Report Engine</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Regulatory Report</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-600 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Treasury Risk & Regulatory Reports</h1>
            <p className="text-sm text-muted-foreground">
              VaR analysis, limit monitoring, stress testing, and regulatory compliance
            </p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      <ReportBuilderModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        reportType="regulatory"
      />

      {/* Report Table */}
      <Card className="border-2 border-border">
        <CardHeader className="border-b-2 border-border pb-4">
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">PerPage</span>
              <Select defaultValue="100">
                <SelectTrigger className="w-20 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              Page {page} of {totalPages || 1}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto border-2 border-gray-300 dark:border-gray-600">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/10">
                  <TableHead className="font-semibold border-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Name
                      <Filter className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold border-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleSort("description")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Description
                      <Filter className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold border-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleSort("category")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Category
                      <Filter className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold border-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Status
                      <Filter className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold border-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Created At
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer hover:bg-primary/5"
                    onClick={() => handleExportReport()}
                  >
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <span className="font-medium text-primary hover:underline">
                        {report.name}
                      </span>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      {report.description}
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <span className="uppercase text-sm">{report.category}</span>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                      {format(report.createdAt, "MMM do, yyyy HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t-2 border-gray-300 dark:border-gray-600 bg-muted/30">
            <div className="text-sm font-medium">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredReports.length)} of {filteredReports.length} reports
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-2 font-medium"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground rounded">
                {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-2 font-medium"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
