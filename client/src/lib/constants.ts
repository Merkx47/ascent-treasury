import {
  LayoutDashboard,
  TrendingUp,
  Repeat,
  Landmark,
  BarChart3,
  PieChart,
  Shield,
  AlertTriangle,
  Settings,
  Bell,
  ClipboardCheck,
  UserCog,
  Users,
  FileText,
  Wallet,
  Building2,
  ArrowLeftRight,
  Calculator,
  LineChart,
  Activity,
  Clock,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Notifications", href: "/notifications", icon: Bell, badge: 5 },
    ],
  },
  {
    title: "Trading & Execution",
    items: [
      { title: "FX Trading", href: "/fx-trading", icon: Repeat },
      { title: "Money Market", href: "/money-market", icon: Wallet },
      { title: "Fixed Income", href: "/fixed-income", icon: Building2 },
      { title: "Derivatives", href: "/derivatives", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Risk Management",
    items: [
      { title: "Risk Dashboard", href: "/risk-management", icon: AlertTriangle },
      { title: "Limit Management", href: "/limits", icon: Shield },
      { title: "VAR Analysis", href: "/var-analysis", icon: Calculator },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { title: "Positions", href: "/positions", icon: PieChart },
      { title: "Maturity Ladder", href: "/maturity", icon: Clock },
      { title: "P&L Report", href: "/pnl", icon: TrendingUp },
    ],
  },
  {
    title: "Back Office",
    items: [
      { title: "Settlements", href: "/settlements", icon: DollarSign },
      { title: "Confirmations", href: "/confirmations", icon: FileText },
      { title: "Accounting", href: "/accounting", icon: Landmark },
    ],
  },
  {
    title: "Workflow",
    items: [
      { title: "Checker Queue", href: "/checker-queue", icon: ClipboardCheck },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "User Management", href: "/user-management", icon: UserCog },
      { title: "Counterparties", href: "/counterparties", icon: Users },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
        children: [
          { title: "Custom Report", href: "/reports/custom", icon: FileText },
          { title: "MIS Report", href: "/reports/mis", icon: BarChart3 },
          { title: "Regulatory Report", href: "/reports/regulatory", icon: Shield },
          { title: "CBN Report", href: "/reports/cbn", icon: Landmark },
        ],
      },
      { title: "Compliance", href: "/compliance", icon: Shield },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

// Treasury Product Types
export const productTypes = {
  // FX Products
  FXSPOT: { name: "FX Spot", code: "FXSPOT", color: "bg-blue-500" },
  FXFORWARD: { name: "FX Forward", code: "FXFORWARD", color: "bg-cyan-500" },
  FXSWAP: { name: "FX Swap", code: "FXSWAP", color: "bg-teal-500" },
  FXNDF: { name: "FX NDF", code: "FXNDF", color: "bg-indigo-500" },

  // Money Market Products
  MMDEPOSIT: { name: "MM Deposit", code: "MMDEPOSIT", color: "bg-green-500" },
  MMLOAN: { name: "MM Loan", code: "MMLOAN", color: "bg-emerald-500" },
  TBILL: { name: "Treasury Bill", code: "TBILL", color: "bg-lime-500" },
  CALLNOTICE: { name: "Call Notice", code: "CALLNOTICE", color: "bg-amber-500" },

  // Fixed Income Products
  GOVBOND: { name: "Government Bond", code: "GOVBOND", color: "bg-purple-500" },
  CORPBOND: { name: "Corporate Bond", code: "CORPBOND", color: "bg-violet-500" },
  EUROBOND: { name: "Eurobond", code: "EUROBOND", color: "bg-fuchsia-500" },

  // Derivatives
  IRS: { name: "Interest Rate Swap", code: "IRS", color: "bg-pink-500" },
  CCS: { name: "Cross Currency Swap", code: "CCS", color: "bg-rose-500" },
  REPO: { name: "Repo Agreement", code: "REPO", color: "bg-orange-500" },
} as const;

// Deal/Trade Statuses
export const dealStatuses = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  verified: { label: "Verified", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  settled: { label: "Settled", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  matured: { label: "Matured", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
} as const;

// Legacy transaction statuses for compatibility
export const transactionStatuses = dealStatuses;

export const currencies = ["NGN", "USD", "EUR", "GBP", "CNY", "CHF", "JPY", "ZAR"] as const;

// Treasury counterparty types
export const counterpartyTypes = [
  { code: "BANK", name: "Bank" },
  { code: "CORP", name: "Corporate" },
  { code: "GOVT", name: "Government" },
  { code: "INSTIT", name: "Institutional Investor" },
  { code: "BROKER", name: "Broker/Dealer" },
  { code: "CBN", name: "Central Bank" },
];

// Nigerian Banks for interbank trading
export const nigerianBanks = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank Nigeria" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank for Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

// Day count conventions for Fixed Income
export const dayCountConventions = [
  "ACT/360",
  "ACT/365",
  "ACT/ACT",
  "30/360",
  "30E/360",
];

// Interest rate benchmarks
export const interestBenchmarks = [
  { code: "NIBOR", name: "Nigeria Interbank Offered Rate", currency: "NGN" },
  { code: "SOFR", name: "Secured Overnight Financing Rate", currency: "USD" },
  { code: "EURIBOR", name: "Euro Interbank Offered Rate", currency: "EUR" },
  { code: "SONIA", name: "Sterling Overnight Index Average", currency: "GBP" },
];

// Tenor periods
export const tenorPeriods = [
  { code: "ON", name: "Overnight", days: 1 },
  { code: "TN", name: "Tomorrow/Next", days: 2 },
  { code: "SN", name: "Spot/Next", days: 3 },
  { code: "1W", name: "1 Week", days: 7 },
  { code: "2W", name: "2 Weeks", days: 14 },
  { code: "1M", name: "1 Month", days: 30 },
  { code: "2M", name: "2 Months", days: 60 },
  { code: "3M", name: "3 Months", days: 90 },
  { code: "6M", name: "6 Months", days: 180 },
  { code: "9M", name: "9 Months", days: 270 },
  { code: "1Y", name: "1 Year", days: 365 },
  { code: "2Y", name: "2 Years", days: 730 },
  { code: "3Y", name: "3 Years", days: 1095 },
  { code: "5Y", name: "5 Years", days: 1825 },
  { code: "10Y", name: "10 Years", days: 3650 },
];

// FX settlement types
export const settlementTypes = [
  { code: "TOD", name: "Same Day (T+0)" },
  { code: "TOM", name: "Tomorrow (T+1)" },
  { code: "SPOT", name: "Spot (T+2)" },
  { code: "FWD", name: "Forward" },
];

// Bond coupon frequencies
export const couponFrequencies = [
  { code: "ANN", name: "Annual" },
  { code: "SEMI", name: "Semi-Annual" },
  { code: "QRTR", name: "Quarterly" },
  { code: "MNTH", name: "Monthly" },
  { code: "ZERO", name: "Zero Coupon" },
];
