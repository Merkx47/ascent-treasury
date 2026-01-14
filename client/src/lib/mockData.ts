import type { Transaction } from "@shared/schema";

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rcNumber: string;
  tin: string;
  accountNumber: string;
  accountName: string;
}

export interface MockFormM {
  id: string;
  transactionId: string;
  formMNumber: string;
  nswRegistrationNumber: string;
  importerName: string;
  importerAddress: string;
  supplierName: string;
  supplierCountry: string;
  goodsDescription: string;
  hsCode: string;
  invoiceValue: string;
  currency: string;
  portOfLoading: string;
  portOfDischarge: string;
  validityDate: Date;
  registrationDate: Date;
  paymentTerms: string;
  cbcApprovalStatus: string;
  sanctionsScreeningResult: string;
}

export interface MockFxTrade {
  id: string;
  transactionId: string;
  tradeReference: string;
  tradeType: string;
  buyCurrency: string;
  sellCurrency: string;
  buyAmount: string;
  sellAmount: string;
  spotRate: string;
  allInRate: string;
  valueDate: Date;
  counterparty: string;
  dealerName: string;
  settlementStatus: string;
}

export interface MockNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  transactionId?: string;
}

export const mockCustomers: MockCustomer[] = [
  {
    id: "cust-001",
    name: "Dangote Industries Limited",
    email: "trade@dangote.com",
    phone: "+234 1 271 0001",
    address: "1 Alfred Rewane Road, Ikoyi, Lagos",
    rcNumber: "RC 123456",
    tin: "1234567890",
    accountNumber: "0123456789",
    accountName: "Dangote Industries Limited",
  },
  {
    id: "cust-002",
    name: "BUA Group",
    email: "trade@buagroup.com",
    phone: "+234 1 461 2345",
    address: "Plot 1036 Adeola Odeku Street, V/I, Lagos",
    rcNumber: "RC 234567",
    tin: "2345678901",
    accountNumber: "0234567890",
    accountName: "BUA Group",
  },
  {
    id: "cust-003",
    name: "Flour Mills of Nigeria Plc",
    email: "imports@fmnplc.com",
    phone: "+234 1 270 8600",
    address: "2 Old Dock Road, Apapa, Lagos",
    rcNumber: "RC 2343",
    tin: "3456789012",
    accountNumber: "0345678901",
    accountName: "Flour Mills of Nigeria Plc",
  },
  {
    id: "cust-004",
    name: "Nigerian Breweries Plc",
    email: "procurement@nb-plc.com",
    phone: "+234 1 271 4600",
    address: "1 Abebe Village Road, Iganmu, Lagos",
    rcNumber: "RC 613",
    tin: "4567890123",
    accountNumber: "0456789012",
    accountName: "Nigerian Breweries Plc",
  },
  {
    id: "cust-005",
    name: "Lafarge Africa Plc",
    email: "treasury@lafarge.ng",
    phone: "+234 1 280 0800",
    address: "27B Gerrard Road, Ikoyi, Lagos",
    rcNumber: "RC 1858",
    tin: "5678901234",
    accountNumber: "0567890123",
    accountName: "Lafarge Africa Plc",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    referenceNumber: "FM-2024-0847",
    productType: "FORMM",
    customerId: "cust-001",
    status: "approved",
    amount: "15750000.00",
    currency: "USD",
    description: "Import of industrial cement production machinery from Germany",
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
    id: "tx-002",
    referenceNumber: "LC-2024-0156",
    productType: "IMPORTLC",
    customerId: "cust-002",
    status: "under_review",
    amount: "2850000.00",
    currency: "USD",
    description: "Letter of credit for electronics import from China",
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
    id: "tx-003",
    referenceNumber: "FX-2024-0923",
    productType: "FXSALES",
    customerId: "cust-003",
    status: "completed",
    amount: "500000.00",
    currency: "USD",
    description: "Spot FX trade USD/NGN for raw materials import",
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
    id: "tx-004",
    referenceNumber: "FA-2024-0412",
    productType: "FORMA",
    customerId: "cust-004",
    status: "pending",
    amount: "125000.00",
    currency: "USD",
    description: "Form A for consultancy services payment to UK firm",
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
    id: "tx-005",
    referenceNumber: "BFC-2024-0078",
    productType: "BFC",
    customerId: "cust-005",
    status: "pending",
    amount: "890000.00",
    currency: "EUR",
    description: "Documentary collection from German supplier for equipment",
    metadata: null,
    assignedTo: "user-001",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    completedAt: null,
    createdBy: "user-003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "tx-006",
    referenceNumber: "FM-2024-0848",
    productType: "FORMM",
    customerId: "cust-002",
    status: "under_review",
    amount: "8500000.00",
    currency: "USD",
    description: "Import of sugar refinery equipment from Brazil",
    metadata: null,
    assignedTo: "user-002",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    completedAt: null,
    createdBy: "user-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: "tx-007",
    referenceNumber: "PAAR-2024-0089",
    productType: "PAAR",
    customerId: "cust-001",
    status: "pending",
    amount: "3200000.00",
    currency: "USD",
    description: "Pre-arrival assessment for manufacturing equipment",
    metadata: null,
    assignedTo: "user-003",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    completedAt: null,
    createdBy: "user-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "tx-008",
    referenceNumber: "NXP-2024-0045",
    productType: "FORMNXP",
    customerId: "cust-003",
    status: "completed",
    amount: "750000.00",
    currency: "USD",
    description: "Export of agricultural commodities to Europe",
    metadata: null,
    assignedTo: "user-004",
    priority: "normal",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    createdBy: "user-003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "tx-009",
    referenceNumber: "TL-2024-0034",
    productType: "LOAN",
    customerId: "cust-004",
    status: "approved",
    amount: "2000000000.00",
    currency: "NGN",
    description: "Trade finance facility for raw materials procurement",
    metadata: null,
    assignedTo: "user-001",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    completedAt: null,
    createdBy: "user-005",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "tx-010",
    referenceNumber: "IWP-2024-0156",
    productType: "INWCP",
    customerId: "cust-005",
    status: "completed",
    amount: "450000.00",
    currency: "GBP",
    description: "Inward payment for export proceeds from UK buyer",
    metadata: null,
    assignedTo: "user-002",
    priority: "normal",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdBy: "user-004",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "tx-011",
    referenceNumber: "OUT-2024-0089",
    productType: "DOMOUTAC",
    customerId: "cust-001",
    status: "pending",
    amount: "175000.00",
    currency: "USD",
    description: "Outward payment for equipment maintenance services",
    metadata: null,
    assignedTo: "user-003",
    priority: "normal",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    completedAt: null,
    createdBy: "user-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: "tx-012",
    referenceNumber: "SD-2024-0234",
    productType: "SHIPPINGDOC",
    customerId: "cust-002",
    status: "under_review",
    amount: "1200000.00",
    currency: "USD",
    description: "Shipping documents for machinery import from Germany",
    metadata: null,
    assignedTo: "user-004",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    completedAt: null,
    createdBy: "user-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
];

export const mockActivities = [
  {
    id: "act-001",
    type: "approved" as const,
    title: "Form M Approved",
    description: "Import documentation for Dangote Industries approved by compliance team",
    user: "Adebayo Ogunlesi",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reference: "FM-2024-0847",
  },
  {
    id: "act-002",
    type: "created" as const,
    title: "New Import LC Created",
    description: "Letter of credit for machinery import from China submitted for review",
    user: "Ngozi Okonkwo",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reference: "LC-2024-0156",
  },
  {
    id: "act-003",
    type: "submitted" as const,
    title: "FX Trade Executed",
    description: "Spot trade USD 500,000 at NGN 1,580.50 executed successfully",
    user: "Chukwuemeka Eze",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reference: "FX-2024-0923",
  },
  {
    id: "act-004",
    type: "rejected" as const,
    title: "Form A Requires Amendments",
    description: "Documentation incomplete - additional BVN verification required",
    user: "Fatima Mohammed",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reference: "FA-2024-0412",
  },
  {
    id: "act-005",
    type: "transferred" as const,
    title: "PAAR Transferred to CBN",
    description: "Transferred to liaison officer for Central Bank processing",
    user: "Ibrahim Yusuf",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    reference: "PAAR-2024-0089",
  },
  {
    id: "act-006",
    type: "updated" as const,
    title: "Trade Loan Documentation Updated",
    description: "Collateral documentation revised for facility committee review",
    user: "Oluwaseun Adeyemi",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    reference: "TL-2024-0034",
  },
  {
    id: "act-007",
    type: "created" as const,
    title: "New PAAR Application",
    description: "Pre-arrival assessment submitted for manufacturing equipment",
    user: "Amina Bello",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    reference: "PAAR-2024-0090",
  },
  {
    id: "act-008",
    type: "approved" as const,
    title: "Export NXP Completed",
    description: "Form NXP for agricultural commodities export processed successfully",
    user: "Emeka Okafor",
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    reference: "NXP-2024-0045",
  },
];

export const mockFxTrades: MockFxTrade[] = [
  {
    id: "fx-001",
    transactionId: "tx-003",
    tradeReference: "FX-2024-0923",
    tradeType: "spot",
    buyCurrency: "NGN",
    sellCurrency: "USD",
    buyAmount: "790250000.00",
    sellAmount: "500000.00",
    spotRate: "1580.50",
    allInRate: "1580.50",
    valueDate: new Date(),
    counterparty: "Flour Mills of Nigeria Plc",
    dealerName: "Chukwuemeka Eze",
    settlementStatus: "completed",
  },
  {
    id: "fx-002",
    transactionId: "tx-013",
    tradeReference: "FX-2024-0924",
    tradeType: "forward",
    buyCurrency: "USD",
    sellCurrency: "NGN",
    buyAmount: "1000000.00",
    sellAmount: "1595000000.00",
    spotRate: "1580.00",
    allInRate: "1595.00",
    valueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    counterparty: "BUA Group",
    dealerName: "Adaeze Nwosu",
    settlementStatus: "pending",
  },
  {
    id: "fx-003",
    transactionId: "tx-014",
    tradeReference: "FX-2024-0925",
    tradeType: "spot",
    buyCurrency: "EUR",
    sellCurrency: "NGN",
    buyAmount: "250000.00",
    sellAmount: "430625000.00",
    spotRate: "1722.50",
    allInRate: "1722.50",
    valueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    counterparty: "Nigerian Breweries Plc",
    dealerName: "Tunde Bakare",
    settlementStatus: "completed",
  },
];

export const mockNotifications: MockNotification[] = [
  {
    id: "notif-001",
    type: "approval_required",
    title: "Approval Required",
    message: "Form M FM-2024-0848 requires your approval for BUA Group sugar equipment import.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    transactionId: "tx-006",
  },
  {
    id: "notif-002",
    type: "transaction_completed",
    title: "Transaction Completed",
    message: "FX Trade FX-2024-0923 has been successfully settled.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    transactionId: "tx-003",
  },
  {
    id: "notif-003",
    type: "compliance_alert",
    title: "Compliance Alert",
    message: "Sanctions screening completed for LC-2024-0156. No matches found.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    transactionId: "tx-002",
  },
  {
    id: "notif-004",
    type: "exception",
    title: "Exception Raised",
    message: "Documentary discrepancy detected in shipping documents SD-2024-0234.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
    transactionId: "tx-012",
  },
  {
    id: "notif-005",
    type: "reminder",
    title: "Due Date Reminder",
    message: "Outward payment OUT-2024-0089 is due in 2 days.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
    transactionId: "tx-011",
  },
];

export const mockWorkflowSteps = [
  { id: "ws-001", stepNumber: 1, stepName: "Application Received", status: "completed" as const, assignedTo: "System", completedAt: "15-Jan-2024 09:30" },
  { id: "ws-002", stepNumber: 2, stepName: "Initial Review", status: "completed" as const, assignedTo: "Ngozi Okonkwo", completedAt: "15-Jan-2024 11:45" },
  { id: "ws-003", stepNumber: 3, stepName: "Compliance Check", status: "completed" as const, assignedTo: "Fatima Mohammed", completedAt: "15-Jan-2024 14:20" },
  { id: "ws-004", stepNumber: 4, stepName: "Manager Approval", status: "current" as const, assignedTo: "Adebayo Ogunlesi" },
  { id: "ws-005", stepNumber: 5, stepName: "NSW Registration", status: "pending" as const },
  { id: "ws-006", stepNumber: 6, stepName: "Completed", status: "pending" as const },
];

export const dashboardStats = {
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

export function getTransactionsByProduct(productType: string): Transaction[] {
  return mockTransactions.filter((tx) => tx.productType === productType);
}

export function getTransactionById(id: string): Transaction | undefined {
  return mockTransactions.find((tx) => tx.id === id);
}

export function getCustomerById(id: string): MockCustomer | undefined {
  return mockCustomers.find((c) => c.id === id);
}

export function getFxTradeByTransactionId(transactionId: string): MockFxTrade | undefined {
  return mockFxTrades.find((fx) => fx.transactionId === transactionId);
}
