import {
  LayoutDashboard,
  FileText,
  FileCheck,
  FileSpreadsheet,
  Ship,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  Landmark,
  FileSearch,
  Users,
  Settings,
  BarChart3,
  Shield,
  Bell,
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
    title: "Trade Finance",
    items: [
      { title: "Form M", href: "/form-m", icon: FileText },
      { title: "Form A", href: "/form-a", icon: FileCheck },
      { title: "Form NXP", href: "/form-nxp", icon: FileSpreadsheet },
      { title: "PAAR", href: "/paar", icon: FileSearch },
      { title: "Import LC", href: "/import-lc", icon: Ship },
      { title: "Bills for Collection", href: "/bfc", icon: CreditCard },
      { title: "Shipping Documents", href: "/shipping-docs", icon: FileText },
    ],
  },
  {
    title: "Treasury",
    items: [
      { title: "FX Trading", href: "/fx-trading", icon: Repeat },
      { title: "Trade Loans", href: "/trade-loans", icon: Landmark },
    ],
  },
  {
    title: "Payments",
    items: [
      { title: "Inward Payments", href: "/inward-payments", icon: ArrowDownToLine },
      { title: "Outward Payments", href: "/outward-payments", icon: ArrowUpFromLine },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Customers", href: "/customers", icon: Users },
      { title: "Reports", href: "/reports", icon: BarChart3 },
      { title: "Compliance", href: "/compliance", icon: Shield },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const productTypes = {
  BFC: { name: "Bills for Collection", code: "BFC", color: "bg-blue-500" },
  FORMA: { name: "Form A Processing", code: "FORMA", color: "bg-green-500" },
  LOAN: { name: "Trade Loan", code: "LOAN", color: "bg-purple-500" },
  PAAR: { name: "PAAR", code: "PAAR", color: "bg-orange-500" },
  FORMNXP: { name: "Form NXP", code: "FORMNXP", color: "bg-teal-500" },
  FORMM: { name: "Form M Processing", code: "FORMM", color: "bg-indigo-500" },
  FXSALES: { name: "Foreign Exchange", code: "FXSALES", color: "bg-pink-500" },
  IMPORTLC: { name: "Import Letter of Credit", code: "IMPORTLC", color: "bg-cyan-500" },
  SHIPPINGDOC: { name: "Shipping Documents", code: "SHIPPINGDOC", color: "bg-amber-500" },
  INWCP: { name: "Inward Payment", code: "INWCP", color: "bg-emerald-500" },
  DOMOUTAC: { name: "Domiciliary Outward", code: "DOMOUTAC", color: "bg-rose-500" },
} as const;

export const transactionStatuses = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  exception: { label: "Exception", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
} as const;

export const currencies = ["NGN", "USD", "EUR", "GBP", "CNY"] as const;

export const nigerianBanks = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank Nigeria" },
  { code: "063", name: "Diamond Bank" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "084", name: "Enterprise Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "SunTrust Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank for Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

export const nigerianPorts = [
  "Apapa Port, Lagos",
  "Tin Can Island Port, Lagos",
  "Onne Port, Rivers",
  "Calabar Port, Cross River",
  "Port Harcourt Port, Rivers",
  "Warri Port, Delta",
];

export const countries = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CN", name: "China" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "ZA", name: "South Africa" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
];

export const incoterms = [
  "EXW - Ex Works",
  "FCA - Free Carrier",
  "CPT - Carriage Paid To",
  "CIP - Carriage and Insurance Paid To",
  "DAP - Delivered at Place",
  "DPU - Delivered at Place Unloaded",
  "DDP - Delivered Duty Paid",
  "FAS - Free Alongside Ship",
  "FOB - Free on Board",
  "CFR - Cost and Freight",
  "CIF - Cost, Insurance and Freight",
];

export const paymentTerms = [
  "Sight LC",
  "Usance LC (30 days)",
  "Usance LC (60 days)",
  "Usance LC (90 days)",
  "Usance LC (120 days)",
  "Usance LC (180 days)",
  "Documents Against Payment (D/P)",
  "Documents Against Acceptance (D/A)",
  "Open Account",
  "Advance Payment",
];
