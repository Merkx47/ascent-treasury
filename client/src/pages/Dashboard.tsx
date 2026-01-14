import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { QuickActions } from "@/components/QuickActions";
import {
  TransactionVolumeChart,
  ProductMixChart,
  StatusDistributionChart,
} from "@/components/DashboardCharts";
import { TransactionTable } from "@/components/TransactionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

const mockActivities = [
  {
    id: "1",
    type: "approved" as const,
    title: "Form M Approved",
    description: "Import documentation for Dangote Industries approved by compliance",
    user: "Adebayo Ogunlesi",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reference: "FM-2024-0847",
  },
  {
    id: "2",
    type: "created" as const,
    title: "New Import LC Created",
    description: "Letter of credit for machinery import from China",
    user: "Ngozi Okonkwo",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reference: "LC-2024-0156",
  },
  {
    id: "3",
    type: "submitted" as const,
    title: "FX Trade Executed",
    description: "USD 500,000 spot trade at NGN 1,580.50",
    user: "Chukwuemeka Eze",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reference: "FX-2024-0923",
  },
  {
    id: "4",
    type: "rejected" as const,
    title: "Form A Rejected",
    description: "Documentation incomplete - missing BVN verification",
    user: "Fatima Mohammed",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reference: "FA-2024-0412",
  },
  {
    id: "5",
    type: "transferred" as const,
    title: "PAAR Transferred",
    description: "Transferred to liaison officer for CBN processing",
    user: "Ibrahim Yusuf",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    reference: "PR-2024-0089",
  },
  {
    id: "6",
    type: "updated" as const,
    title: "Trade Loan Updated",
    description: "Collateral documentation updated for facility review",
    user: "Oluwaseun Adeyemi",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    reference: "TL-2024-0034",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    referenceNumber: "FM-2024-0847",
    productType: "FORMM",
    customerId: "cust-001",
    status: "approved",
    amount: "15750000.00",
    currency: "USD",
    description: "Import of industrial machinery",
    metadata: null,
    assignedTo: "user-001",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    completedAt: null,
    createdBy: "user-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    referenceNumber: "LC-2024-0156",
    productType: "IMPORTLC",
    customerId: "cust-002",
    status: "under_review",
    amount: "2850000.00",
    currency: "USD",
    description: "Letter of credit for electronics import",
    metadata: null,
    assignedTo: "user-003",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    completedAt: null,
    createdBy: "user-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    referenceNumber: "FX-2024-0923",
    productType: "FXSALES",
    customerId: "cust-003",
    status: "completed",
    amount: "500000.00",
    currency: "USD",
    description: "Spot FX trade USD/NGN",
    metadata: null,
    assignedTo: "user-004",
    priority: "high",
    dueDate: new Date(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60),
    createdBy: "user-004",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "4",
    referenceNumber: "FA-2024-0412",
    productType: "FORMA",
    customerId: "cust-004",
    status: "pending",
    amount: "125000.00",
    currency: "USD",
    description: "Form A for consultancy services payment",
    metadata: null,
    assignedTo: "user-002",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    completedAt: null,
    createdBy: "user-005",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "5",
    referenceNumber: "BFC-2024-0078",
    productType: "BFC",
    customerId: "cust-005",
    status: "pending",
    amount: "890000.00",
    currency: "EUR",
    description: "Documentary collection from German supplier",
    metadata: null,
    assignedTo: "user-001",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    completedAt: null,
    createdBy: "user-003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export default function Dashboard() {
  const statsData = {
    totalTransactions: 1815,
    previousTransactions: 1654,
    pendingApprovals: 47,
    previousPending: 52,
    exceptions: 12,
    previousExceptions: 8,
    completedToday: 23,
    previousCompleted: 18,
    fxVolume: 45200000,
    previousFxVolume: 38500000,
    revenue: 125000000,
    previousRevenue: 112000000,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trade operations overview and performance metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Transactions"
          value={statsData.totalTransactions}
          previousValue={statsData.previousTransactions}
          currentValue={statsData.totalTransactions}
          icon={FileText}
          description="vs last month"
        />
        <StatsCard
          title="Pending Approvals"
          value={statsData.pendingApprovals}
          previousValue={statsData.previousPending}
          currentValue={statsData.pendingApprovals}
          icon={Clock}
          iconColor="text-yellow-600"
          description="vs last month"
        />
        <StatsCard
          title="Exceptions"
          value={statsData.exceptions}
          previousValue={statsData.previousExceptions}
          currentValue={statsData.exceptions}
          icon={AlertTriangle}
          iconColor="text-red-600"
          description="vs last month"
        />
        <StatsCard
          title="Completed Today"
          value={statsData.completedToday}
          previousValue={statsData.previousCompleted}
          currentValue={statsData.completedToday}
          icon={CheckCircle}
          iconColor="text-green-600"
          description="vs yesterday"
        />
        <StatsCard
          title="FX Volume (USD)"
          value="$45.2M"
          previousValue={statsData.previousFxVolume}
          currentValue={statsData.fxVolume}
          icon={TrendingUp}
          iconColor="text-cyan-600"
          description="vs last month"
        />
        <StatsCard
          title="Fee Revenue"
          value="NGN 125M"
          previousValue={statsData.previousRevenue}
          currentValue={statsData.revenue}
          icon={DollarSign}
          iconColor="text-emerald-600"
          description="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionVolumeChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductMixChart />
        <StatusDistributionChart />
        <ActivityFeed activities={mockActivities} />
      </div>

      <Card className="border border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all" data-testid="tab-all-transactions">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending-transactions">
                Pending
              </TabsTrigger>
              <TabsTrigger value="exceptions" data-testid="tab-exception-transactions">
                Exceptions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TransactionTable transactions={mockTransactions} />
            </TabsContent>
            <TabsContent value="pending">
              <TransactionTable
                transactions={mockTransactions.filter((t) => t.status === "pending")}
              />
            </TabsContent>
            <TabsContent value="exceptions">
              <TransactionTable
                transactions={mockTransactions.filter((t) => t.status === "exception")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
