import { useState } from "react";
import { AnimatedStatsCard } from "@/components/AnimatedStatsCard";
import { TransactionTrendChart } from "@/components/TransactionTrendChart";
import { LiveFxRates } from "@/components/LiveFxRates";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionModal } from "@/components/TransactionModal";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { mockTransactions } from "@/lib/mockData";
import {
  unifiedDashboardStats,
  unifiedActiveResources,
  previousActiveResources,
} from "@/lib/dashboardAggregation";
import type { Transaction } from "@shared/schema";

export default function Dashboard() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30days");

  const handleView = (tx: Transaction) => {
    setSelectedTx(tx);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const recentTransactions = mockTransactions.slice(0, 10);

  const statsCards = [
    {
      title: "Total Transactions",
      value: unifiedDashboardStats.totalTransactions,
      previousValue: unifiedDashboardStats.previousTransactions,
      icon: FileText,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "vs previous period",
    },
    {
      title: "Pending Approvals",
      value: unifiedDashboardStats.pendingApprovals,
      previousValue: unifiedDashboardStats.previousPending,
      icon: Clock,
      iconBgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      description: "awaiting review",
    },
    {
      title: "Active Processing",
      value: unifiedActiveResources,
      previousValue: previousActiveResources,
      icon: CheckCircle,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "in progress today",
    },
    {
      title: "Exceptions",
      value: unifiedDashboardStats.exceptions,
      previousValue: unifiedDashboardStats.previousExceptions,
      icon: AlertTriangle,
      iconBgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      description: "requires attention",
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trade Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trade operations analytics and optimization for <span className="text-primary font-medium">All Products</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="border-2 border-border px-3 py-1.5">
            30D Volume: <span className="font-bold text-primary ml-1">₦{(unifiedDashboardStats.spent / 1000000000).toFixed(1)}B</span>
            <span className="text-green-600 ml-1.5 text-xs">+{((unifiedDashboardStats.spent - unifiedDashboardStats.previousSpent) / unifiedDashboardStats.previousSpent * 100).toFixed(1)}%</span>
          </Badge>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 border-2 border-border">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <AnimatedStatsCard
            key={card.title}
            {...card}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionTrendChart />
        </div>
        <div>
          <LiveFxRates />
        </div>
      </div>

      <TransactionTable
        transactions={recentTransactions}
        title="Recent Transactions"
        onView={handleView}
        onEdit={handleEdit}
      />

      <TransactionModal
        transaction={selectedTx}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
      />
    </div>
  );
}
