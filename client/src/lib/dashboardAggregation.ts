import { mockTransactions } from "./mockData";

function aggregateTransactionsByDate() {
  const txByDate: Record<string, { count: number; value: number }> = {};
  
  mockTransactions.forEach((tx) => {
    const createdAt = tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt);
    const dateKey = createdAt.toISOString().split("T")[0];
    if (!txByDate[dateKey]) {
      txByDate[dateKey] = { count: 0, value: 0 };
    }
    txByDate[dateKey].count += 1;
    txByDate[dateKey].value += parseFloat(tx.amount || "0");
  });
  
  return txByDate;
}

const txByDate = aggregateTransactionsByDate();
const sortedDates = Object.keys(txByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

const dateEntries = sortedDates.map(date => ({
  date,
  ...txByDate[date]
}));

const last30DaysDates = dateEntries.slice(-30);
const historicalAvg = last30DaysDates.length > 0 
  ? last30DaysDates.reduce((sum, d) => sum + d.value, 0) / last30DaysDates.length 
  : 0;

export const unifiedTransactionTrendData = last30DaysDates.map((entry, index) => {
  const d = new Date(entry.date);
  const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isLastThree = index >= last30DaysDates.length - 3;
  
  const forecastValue = historicalAvg * (1 + (index - last30DaysDates.length + 4) * 0.03);
  
  return {
    date: dateLabel,
    actual: isLastThree ? null : entry.value,
    forecast: isLastThree ? forecastValue : (index === last30DaysDates.length - 4 ? entry.value : null),
  };
});

const actualData = unifiedTransactionTrendData.filter(d => d.actual !== null);
const totalActualVolume = actualData.reduce((sum, d) => sum + (d.actual || 0), 0);
const dailyAvg = actualData.length > 0 ? totalActualVolume / actualData.length : 0;

export const unifiedTrendStats = {
  totalVolume: totalActualVolume,
  dailyAverage: dailyAvg,
};

const totalTransactionValue = mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);

const budgetValue = totalTransactionValue * 1.3;
const spentValue = totalTransactionValue;
const previousSpentValue = spentValue * 0.9;

const pendingCount = mockTransactions.filter(t => t.status === "pending" || t.status === "under_review").length;
const completedCount = mockTransactions.filter(t => t.status === "completed").length;
const completedTodayCount = Math.min(completedCount, 25);

export const unifiedDashboardStats = {
  totalTransactions: mockTransactions.length,
  previousTransactions: Math.floor(mockTransactions.length * 0.85),
  
  pendingApprovals: pendingCount,
  previousPending: Math.floor(pendingCount * 0.9),
  
  exceptions: mockTransactions.filter(t => t.status === "exception").length,
  previousExceptions: Math.floor(mockTransactions.filter(t => t.status === "exception").length * 1.1),
  
  completedToday: completedTodayCount,
  previousCompleted: 18,
  
  budget: budgetValue,
  spent: spentValue,
  previousSpent: previousSpentValue,
  
  potentialSavings: spentValue * 0.08,
  previousSavings: spentValue * 0.07,
};

export const unifiedBudgetUtilization = (unifiedDashboardStats.spent / unifiedDashboardStats.budget) * 100;
export const previousBudgetUtilization = (unifiedDashboardStats.previousSpent / unifiedDashboardStats.budget) * 100;

export const unifiedActiveResources = unifiedDashboardStats.pendingApprovals + unifiedDashboardStats.completedToday;
export const previousActiveResources = unifiedDashboardStats.previousPending + unifiedDashboardStats.previousCompleted;
