import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TransactionVolumeChart,
  ProductMixChart,
  StatusDistributionChart,
} from "@/components/DashboardCharts";
import { BarChart3, Download, Calendar, FileText, Printer } from "lucide-react";

const reportTypes = [
  {
    id: "transaction-register",
    name: "Transaction Register",
    description: "Complete list of all trade transactions with details",
    icon: FileText,
  },
  {
    id: "fee-income",
    name: "Fee Income Report",
    description: "Breakdown of fees collected by product and period",
    icon: BarChart3,
  },
  {
    id: "aging-analysis",
    name: "Aging Analysis",
    description: "Outstanding transactions by age bucket",
    icon: Calendar,
  },
  {
    id: "regulatory-returns",
    name: "Regulatory Returns",
    description: "CBN and NSW reporting requirements",
    icon: FileText,
  },
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Analytics and reporting suite
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[180px]" data-testid="select-period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className="border border-card-border hover-elevate cursor-pointer"
            data-testid={`report-card-${report.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-accent">
                  <report.icon className="w-5 h-5 text-primary" />
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold mt-4">{report.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {report.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionVolumeChart />
        <ProductMixChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart />
        <Card className="border border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Quick Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col" data-testid="button-export-pdf">
                <Download className="w-5 h-5 mb-2" />
                <span>Export PDF</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="button-export-excel">
                <FileText className="w-5 h-5 mb-2" />
                <span>Export Excel</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="button-export-csv">
                <FileText className="w-5 h-5 mb-2" />
                <span>Export CSV</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="button-print">
                <Printer className="w-5 h-5 mb-2" />
                <span>Print Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
