import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Shield,
  Landmark,
  ArrowRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  PieChart,
  Activity,
} from "lucide-react";

const reportModules = [
  {
    id: "custom",
    name: "Custom Report",
    description: "Build custom treasury reports with flexible data selection and visualization options",
    icon: FileText,
    href: "/reports/custom",
    color: "bg-blue-600",
    count: 12,
    features: ["Deal Blotter", "Position Report", "P&L Analysis", "Cash Flow Report"],
  },
  {
    id: "mis",
    name: "MIS Report",
    description: "Management Information System reports with KPIs and treasury performance analytics",
    icon: BarChart3,
    href: "/reports/mis",
    color: "bg-green-600",
    count: 10,
    features: ["Trading Volume", "Desk Performance", "Revenue Analysis", "Counterparty Activity"],
  },
  {
    id: "regulatory",
    name: "Regulatory Report",
    description: "Compliance status, risk reports, and regulatory submissions",
    icon: Shield,
    href: "/reports/regulatory",
    color: "bg-amber-600",
    count: 8,
    features: ["VAR Report", "Limit Utilization", "Stress Testing", "Compliance Status"],
  },
  {
    id: "cbn",
    name: "CBN Monthly Report",
    description: "Central Bank of Nigeria treasury returns and FX reporting",
    icon: Landmark,
    href: "/reports/cbn",
    color: "bg-purple-600",
    count: 9,
    features: ["FX Position Report", "Treasury Bills Holdings", "Bond Portfolio", "Interest Rate Report"],
  },
];

const recentReports = [
  { name: "Daily FX Position Report", date: "Jan 16, 2026", status: "completed", type: "FX" },
  { name: "Monthly P&L Summary", date: "Jan 15, 2026", status: "completed", type: "P&L" },
  { name: "CBN Monthly Return - Dec 2025", date: "Jan 10, 2026", status: "submitted", type: "CBN" },
  { name: "VAR Analysis Report", date: "Jan 08, 2026", status: "completed", type: "Risk" },
  { name: "Counterparty Exposure Report", date: "Jan 05, 2026", status: "completed", type: "Risk" },
];

const quickStats = {
  dailyVolume: 45.2,
  mtdPnL: 9.8,
  pendingSettlements: 23,
  limitUtilization: 72,
};

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
            <BreadcrumbPage>Report Engine</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Treasury Report Engine</h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive reporting suite for treasury operations
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Volume</p>
                <p className="text-2xl font-bold">${quickStats.dailyVolume}B</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% vs avg</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTD P&L</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+${quickStats.mtdPnL}M</p>
                <p className="text-xs text-muted-foreground mt-1">Realized + Unrealized</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Settlements</p>
                <p className="text-2xl font-bold">{quickStats.pendingSettlements}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">8 due today</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Limit Utilization</p>
                <p className="text-2xl font-bold">{quickStats.limitUtilization}%</p>
                <p className="text-xs text-muted-foreground mt-1">All limits combined</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Modules Grid */}
      <div className="grid grid-cols-2 gap-6">
        {reportModules.map((module) => (
          <Link key={module.id} href={module.href}>
            <Card className="border-2 border-border hover:border-primary/50 transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${module.color} text-white`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border">
                      {module.count} reports
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <CardTitle className="mt-4">{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {module.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Reports & Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Reports */}
        <Card className="col-span-2 border-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Recently generated and viewed reports</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-2">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${
                      report.type === "FX" ? "bg-blue-100 dark:bg-blue-900/30" :
                      report.type === "P&L" ? "bg-green-100 dark:bg-green-900/30" :
                      report.type === "CBN" ? "bg-purple-100 dark:bg-purple-900/30" :
                      "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {report.type === "FX" ? <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" /> :
                       report.type === "P&L" ? <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                       report.type === "CBN" ? <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" /> :
                       <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`border ${
                      report.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                    style={{ borderWidth: "1px" }}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">39</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reports This Month</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CBN Submissions</p>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/reports/custom">
            <Button className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Create New Report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
