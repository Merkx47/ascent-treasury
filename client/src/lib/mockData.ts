import type { Transaction } from "@shared/schema";

// Nigerian First Names
const nigerianFirstNames = [
  "Adebayo", "Chidinma", "Oluwaseun", "Ngozi", "Chukwuemeka", "Fatima", "Ibrahim", "Aisha",
  "Olumide", "Blessing", "Emeka", "Funke", "Tunde", "Amara", "Obinna", "Yetunde",
  "Ifeanyi", "Titilayo", "Chinedu", "Folake", "Adaeze", "Kayode", "Nneka", "Babatunde",
  "Chinonso", "Modupe", "Ikenna", "Ronke", "Uche", "Shade", "Nnamdi", "Bukola",
  "Obiora", "Kemi", "Ugochukwu", "Sade", "Adekunle", "Chisom", "Segun", "Vivian",
  "Olamide", "Grace", "Damilola", "Peace", "Chidi", "Joy", "Femi", "Happiness",
  "Godwin", "Mercy", "Victor", "Patience", "Samuel", "Charity", "David", "Faith",
  "Michael", "Hope", "Daniel", "Love", "Peter", "Precious", "Paul", "Divine"
];

const nigerianLastNames = [
  "Okonkwo", "Adeyemi", "Eze", "Mohammed", "Okafor", "Bello", "Nwosu", "Abubakar",
  "Okwu", "Yusuf", "Onyekachi", "Musa", "Igwe", "Suleiman", "Chukwu", "Abdullahi",
  "Nwachukwu", "Aliyu", "Osagie", "Garba", "Obi", "Danjuma", "Uzoma", "Tanko",
  "Akinwunmi", "Shehu", "Ogbonna", "Usman", "Oyelaran", "Ibrahim", "Anyanwu", "Hassan",
  "Ezeani", "Audu", "Umeh", "Lawal", "Onuoha", "Idris", "Udoh", "Jibril",
  "Okorie", "Ahmad", "Nwankwo", "Nuhu", "Ekwueme", "Salisu", "Azikiwe", "Bala",
  "Ogundimu", "Kabir", "Achebe", "Yakubu", "Ojukwu", "Danfodio", "Okeke", "Gwarzo"
];

const nigerianCompanies = [
  "Dangote Industries Ltd", "BUA Group", "Flour Mills of Nigeria Plc", "Nigerian Breweries Plc",
  "Lafarge Africa Plc", "Nestle Nigeria Plc", "Unilever Nigeria Plc", "Cadbury Nigeria Plc",
  "PZ Cussons Nigeria Plc", "Honeywell Flour Mills Plc", "Guinness Nigeria Plc", "International Breweries Plc",
  "Nigerian Bottling Company", "Procter & Gamble Nigeria", "GSK Nigeria Plc", "May & Baker Nigeria Plc",
  "Fidson Healthcare Plc", "Pharma Deko Plc", "Julius Berger Nigeria Plc", "Oando Plc",
  "Seplat Energy Plc", "Conoil Plc", "Total Nigeria Plc", "MRS Oil Nigeria Plc",
  "Ardova Plc (AP)", "Zenith Bank Plc", "GTBank Plc", "First Bank of Nigeria Ltd",
  "Access Bank Plc", "UBA Plc", "Fidelity Bank Plc", "Stanbic IBTC Bank",
  "Ecobank Nigeria Ltd", "Sterling Bank Plc", "Union Bank of Nigeria Plc", "Wema Bank Plc",
  "Nigerian Cement Company", "Cement Company of Northern Nigeria", "Ashaka Cement Plc", "Ibeto Cement",
  "Obajana Cement Company", "Falcon Corporation Ltd", "Nigerian Eagle Flour Mills", "Crown Flour Mills",
  "Olam Nigeria Ltd", "Stallion Group", "Tolaram Group", "Indomie Nigeria", "De-United Foods Industries",
  "Chi Ltd", "Mikano International Ltd", "Mantrac Nigeria Ltd", "CFAO Nigeria",
  "Friesland Campina WAMCO", "FrieslandCampina Nigeria", "TGI Distri Ltd", "Tropical General Investments",
  "Niger Mills Company", "Vita Foam Nigeria Plc", "Mouka Foam", "Erisco Foods Ltd",
  "Beloxxi Industries Ltd", "Sona Agro Allied Foods", "Dufil Prima Foods Plc", "Rite Foods Ltd",
  "Nigerian Aviation Handling Company", "Bi-Courtney Aviation Services", "Dana Air", "Air Peace",
  "Ibom Air", "Arik Air", "Azman Air", "Max Air", "United Nigeria Airlines",
  "Nigerian Ports Authority", "NNPC Ltd", "Shell Petroleum Development", "ExxonMobil Nigeria",
  "Chevron Nigeria Ltd", "Agip Oil Company", "Addax Petroleum", "Pan Ocean Oil Corporation",
  "MTN Nigeria", "Airtel Nigeria", "Globacom Ltd", "9mobile", "Smile Communications",
  "IHS Towers Nigeria", "American Tower Corporation", "Interswitch Group", "Flutterwave",
  "Paystack", "Kuda Bank", "OPay", "PalmPay", "Moniepoint", "Carbon", "Piggyvest"
];

const nigerianAddresses = [
  "1 Alfred Rewane Road, Ikoyi, Lagos",
  "Plot 1036 Adeola Odeku Street, Victoria Island, Lagos",
  "2 Old Dock Road, Apapa, Lagos",
  "1 Abebe Village Road, Iganmu, Lagos",
  "27B Gerrard Road, Ikoyi, Lagos",
  "15 Kofo Abayomi Street, Victoria Island, Lagos",
  "Plot 1071 Adetokunbo Ademola Street, Victoria Island, Lagos",
  "42 Marina Street, Lagos Island, Lagos",
  "Plot 999 Port Harcourt Road, Trans Amadi, Port Harcourt",
  "Block A, Central Business District, Abuja",
  "Plot 758 Herbert Macaulay Way, Wuse Zone 6, Abuja",
  "22 Adeola Hopewell Street, Victoria Island, Lagos",
  "5 Creek Road, Apapa, Lagos",
  "Industrial Avenue, Ota, Ogun State",
  "Agbara Industrial Estate, Ogun State",
  "7 Aromire Avenue, Ikeja, Lagos",
  "Plot 2, Oregun Road, Ikeja, Lagos",
  "12 Commercial Avenue, Yaba, Lagos",
  "1 Warehouse Road, Apapa, Lagos",
  "Plot 1679 Oyin Jolayemi Street, Victoria Island, Lagos"
];

const goodsDescriptions = [
  "Industrial machinery and spare parts", "Pharmaceutical raw materials and APIs",
  "Agricultural equipment and tractors", "Electronic components and semiconductors",
  "Textile raw materials and fabrics", "Chemical products and fertilizers",
  "Crude palm oil and vegetable oils", "Steel products and construction materials",
  "Medical equipment and hospital supplies", "Automotive parts and accessories",
  "Food processing equipment", "Packaging materials and containers",
  "Industrial pumps and valves", "Electrical cables and wiring",
  "Plastic raw materials and polymers", "Paper and printing materials",
  "Cement and building materials", "Laboratory equipment and reagents",
  "Computer hardware and IT equipment", "Telecommunications equipment",
  "Rice milling machinery", "Palm kernel crushing machines",
  "Flour milling equipment", "Beverage production machinery",
  "Sugar refining equipment", "Dairy processing machinery"
];

const exportGoods = [
  "Crude petroleum oil", "Liquefied natural gas", "Cocoa beans and products",
  "Cashew nuts", "Sesame seeds", "Ginger", "Hibiscus flowers",
  "Shea butter and shea nuts", "Rubber products", "Leather and hides",
  "Textiles and fabrics", "Processed cassava chips", "Palm kernel oil",
  "Cotton", "Groundnuts", "Kolanut", "Tiger nuts", "Moringa products"
];

const purposeOfPayments = [
  "Payment for consultancy services", "Software licensing fees",
  "Technical service agreement", "Management fees",
  "Dividend repatriation", "Loan principal repayment",
  "Interest payment on external loan", "Royalty payment",
  "Trademark licensing fees", "Professional services fees",
  "Training and development fees", "Subscription services",
  "Cloud computing services", "Marketing and advertising services",
  "Insurance premium payment", "Freight and shipping charges"
];

// Generate random Nigerian name
function generateNigerianName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = nigerianFirstNames[Math.floor(Math.random() * nigerianFirstNames.length)];
  const lastName = nigerianLastNames[Math.floor(Math.random() * nigerianLastNames.length)];
  return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}

// Generate random amount based on currency
function generateAmount(currency: string, min: number, max: number): string {
  const amount = Math.random() * (max - min) + min;
  return amount.toFixed(2);
}

// Generate random date within range
function generateDate(daysAgo: number, daysAhead: number = 0): Date {
  const now = Date.now();
  const start = now - daysAgo * 24 * 60 * 60 * 1000;
  const end = now + daysAhead * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (end - start));
}

// Generate reference number
function generateRef(prefix: string, index: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(4, "0")}`;
}

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
  relationshipManager: string;
  sector: string;
  status: string;
  totalTransactions: number;
  totalVolume: number;
  currency: string;
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

// Generate 100 mock customers
export const mockCustomers: MockCustomer[] = Array.from({ length: 100 }, (_, i) => {
  const company = nigerianCompanies[i % nigerianCompanies.length];
  const rm = generateNigerianName();
  const sectors = ["Manufacturing", "Banking", "Oil & Gas", "Telecommunications", "Agriculture", "Healthcare", "FMCG", "Construction", "Aviation", "Fintech"];
  
  return {
    id: `cust-${String(i + 1).padStart(3, "0")}`,
    name: company,
    email: `trade@${company.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15)}.com.ng`,
    phone: `+234 ${Math.floor(Math.random() * 9) + 1}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
    address: nigerianAddresses[i % nigerianAddresses.length],
    rcNumber: `RC ${Math.floor(Math.random() * 900000) + 100000}`,
    tin: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    accountName: company,
    relationshipManager: rm.fullName,
    sector: sectors[i % sectors.length],
    status: Math.random() > 0.1 ? "active" : "inactive",
    totalTransactions: Math.floor(Math.random() * 50) + 1,
    totalVolume: Math.floor(Math.random() * 100000000) + 1000000,
    currency: "NGN",
  };
});

// Product types and statuses
const productTypes = ["FORMM", "FORMA", "FORMNXP", "PAAR", "IMPORTLC", "BFC", "SHIPPINGDOC", "FXSALES", "LOAN", "INWCP", "DOMOUTAC"];
const statuses = ["draft", "pending", "under_review", "approved", "rejected", "completed", "exception"];
const priorities = ["low", "normal", "high", "urgent"];
const currencies = ["USD", "EUR", "GBP", "CNY", "NGN"];

// Generate 500+ mock transactions
export const mockTransactions: Transaction[] = Array.from({ length: 550 }, (_, i) => {
  const productType = productTypes[i % productTypes.length];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const currency = productType === "LOAN" ? "NGN" : currencies[Math.floor(Math.random() * 4)];
  const customer = mockCustomers[i % mockCustomers.length];
  const creator = generateNigerianName();
  const assignee = generateNigerianName();
  
  const prefixMap: Record<string, string> = {
    FORMM: "FM", FORMA: "FA", FORMNXP: "NXP", PAAR: "PR", IMPORTLC: "LC",
    BFC: "BFC", SHIPPINGDOC: "SD", FXSALES: "FX", LOAN: "TL", INWCP: "IWP", DOMOUTAC: "OUT"
  };
  
  const amountRanges: Record<string, [number, number]> = {
    FORMM: [100000, 50000000], FORMA: [10000, 5000000], FORMNXP: [50000, 10000000],
    PAAR: [100000, 25000000], IMPORTLC: [500000, 100000000], BFC: [100000, 20000000],
    SHIPPINGDOC: [50000, 15000000], FXSALES: [10000, 10000000], LOAN: [50000000, 5000000000],
    INWCP: [10000, 5000000], DOMOUTAC: [5000, 2000000]
  };
  
  const [min, max] = amountRanges[productType] || [10000, 1000000];
  const descriptions = productType === "FORMNXP" ? exportGoods : (productType === "FORMA" ? purposeOfPayments : goodsDescriptions);
  
  return {
    id: `tx-${String(i + 1).padStart(4, "0")}`,
    referenceNumber: generateRef(prefixMap[productType], i + 1),
    productType,
    customerId: customer.id,
    status,
    amount: generateAmount(currency, min, max),
    currency,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    metadata: null,
    assignedTo: `user-${String((i % 20) + 1).padStart(3, "0")}`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    dueDate: generateDate(-10, 30),
    completedAt: status === "completed" ? generateDate(30, 0) : null,
    createdBy: `user-${String((i % 15) + 1).padStart(3, "0")}`,
    createdAt: generateDate(90, 0),
    updatedAt: generateDate(30, 0),
  };
});

// Generate 100+ FX trades
export const mockFxTrades: MockFxTrade[] = Array.from({ length: 120 }, (_, i) => {
  const dealer = generateNigerianName();
  const customer = mockCustomers[i % mockCustomers.length];
  const tradeTypes = ["spot", "forward", "swap", "ndf"];
  const currencyPairs = [
    { buy: "NGN", sell: "USD", rate: 1580 + Math.random() * 20 },
    { buy: "NGN", sell: "EUR", rate: 1720 + Math.random() * 30 },
    { buy: "NGN", sell: "GBP", rate: 2000 + Math.random() * 40 },
    { buy: "USD", sell: "NGN", rate: 1580 + Math.random() * 20 },
  ];
  
  const pair = currencyPairs[i % currencyPairs.length];
  const sellAmount = Math.floor(Math.random() * 5000000) + 100000;
  
  return {
    id: `fx-${String(i + 1).padStart(3, "0")}`,
    transactionId: `tx-fx-${String(i + 1).padStart(4, "0")}`,
    tradeReference: generateRef("FX", i + 1),
    tradeType: tradeTypes[Math.floor(Math.random() * tradeTypes.length)],
    buyCurrency: pair.buy,
    sellCurrency: pair.sell,
    buyAmount: (sellAmount * pair.rate).toFixed(2),
    sellAmount: sellAmount.toFixed(2),
    spotRate: pair.rate.toFixed(4),
    allInRate: (pair.rate + Math.random() * 5).toFixed(4),
    valueDate: generateDate(-5, 30),
    counterparty: customer.name,
    dealerName: dealer.fullName,
    settlementStatus: Math.random() > 0.3 ? "completed" : "pending",
  };
});

// Generate 50+ notifications
export const mockNotifications: MockNotification[] = Array.from({ length: 60 }, (_, i) => {
  const types = ["approval_required", "transaction_completed", "compliance_alert", "exception", "reminder", "system"];
  const type = types[i % types.length];
  
  const titles: Record<string, string[]> = {
    approval_required: ["Approval Required", "Pending Authorization", "Review Needed"],
    transaction_completed: ["Transaction Completed", "Processing Complete", "Settlement Confirmed"],
    compliance_alert: ["Compliance Alert", "Screening Complete", "Verification Required"],
    exception: ["Exception Raised", "Discrepancy Found", "Action Required"],
    reminder: ["Due Date Reminder", "Expiry Alert", "Pending Action"],
    system: ["System Update", "Maintenance Notice", "New Feature Available"],
  };
  
  const tx = mockTransactions[i % mockTransactions.length];
  
  return {
    id: `notif-${String(i + 1).padStart(3, "0")}`,
    type,
    title: titles[type][Math.floor(Math.random() * titles[type].length)],
    message: `${type === "approval_required" ? "Your approval is required for" : type === "transaction_completed" ? "Successfully processed" : "Please review"} transaction ${tx.referenceNumber} for ${mockCustomers[i % mockCustomers.length].name}`,
    isRead: Math.random() > 0.4,
    createdAt: generateDate(7, 0),
    transactionId: tx.id,
  };
});

// Generate activities from transactions
export const mockActivities = mockTransactions.slice(0, 50).map((tx, i) => {
  const types = ["created", "approved", "rejected", "updated", "submitted", "transferred"] as const;
  const user = generateNigerianName();
  
  return {
    id: `act-${String(i + 1).padStart(3, "0")}`,
    type: types[i % types.length],
    title: `${tx.productType} ${types[i % types.length].charAt(0).toUpperCase() + types[i % types.length].slice(1)}`,
    description: `Transaction ${tx.referenceNumber} for ${mockCustomers[parseInt(tx.customerId.split("-")[1]) - 1]?.name || "Customer"}`,
    user: user.fullName,
    timestamp: tx.updatedAt?.toISOString() || new Date().toISOString(),
    reference: tx.referenceNumber,
  };
});

// Workflow steps
export const mockWorkflowSteps = [
  { id: "ws-001", stepNumber: 1, stepName: "Application Received", status: "completed" as const, assignedTo: "System", completedAt: "15-Jan-2024 09:30" },
  { id: "ws-002", stepNumber: 2, stepName: "Initial Review", status: "completed" as const, assignedTo: generateNigerianName().fullName, completedAt: "15-Jan-2024 11:45" },
  { id: "ws-003", stepNumber: 3, stepName: "Compliance Check", status: "completed" as const, assignedTo: generateNigerianName().fullName, completedAt: "15-Jan-2024 14:20" },
  { id: "ws-004", stepNumber: 4, stepName: "Manager Approval", status: "current" as const, assignedTo: generateNigerianName().fullName },
  { id: "ws-005", stepNumber: 5, stepName: "NSW Registration", status: "pending" as const },
  { id: "ws-006", stepNumber: 6, stepName: "Completed", status: "pending" as const },
];

// Dashboard stats
export const dashboardStats = {
  totalTransactions: mockTransactions.length,
  previousTransactions: Math.floor(mockTransactions.length * 0.85),
  pendingApprovals: mockTransactions.filter(t => t.status === "pending" || t.status === "under_review").length,
  previousPending: 52,
  exceptions: mockTransactions.filter(t => t.status === "exception").length,
  previousExceptions: 8,
  completedToday: Math.floor(Math.random() * 30) + 10,
  previousCompleted: 18,
  fxVolume: 45200000,
  previousFxVolume: 38500000,
  revenue: 125000000,
  previousRevenue: 112000000,
};

// Helper functions
export function getTransactionsByProduct(productType: string): Transaction[] {
  return mockTransactions.filter((tx) => tx.productType === productType);
}

export function getTransactionById(id: string): Transaction | undefined {
  return mockTransactions.find((tx) => tx.id === id);
}

export function getCustomerById(id: string): MockCustomer | undefined {
  return mockCustomers.find((c) => c.id === id);
}

export function getCustomerByTransactionId(transactionId: string): MockCustomer | undefined {
  const tx = getTransactionById(transactionId);
  return tx ? getCustomerById(tx.customerId) : undefined;
}

export function getFxTradeByTransactionId(transactionId: string): MockFxTrade | undefined {
  return mockFxTrades.find((fx) => fx.transactionId === transactionId);
}

// FX Rates for live display
export const fxRates = [
  { pair: "USD/NGN", bid: 1578.50, ask: 1582.50, change: 0.15, flag: "us" },
  { pair: "EUR/NGN", bid: 1720.25, ask: 1725.75, change: -0.08, flag: "eu" },
  { pair: "GBP/NGN", bid: 1998.00, ask: 2004.50, change: 0.22, flag: "gb" },
  { pair: "CNY/NGN", bid: 218.50, ask: 220.25, change: -0.12, flag: "cn" },
  { pair: "CHF/NGN", bid: 1745.00, ask: 1752.00, change: 0.05, flag: "ch" },
  { pair: "JPY/NGN", bid: 10.45, ask: 10.55, change: -0.03, flag: "jp" },
];

// Transaction trend chart data (last 30 days with 7-day forecast)
export const transactionTrendData = [
  { date: "Dec 16", actual: 58000000, forecast: null },
  { date: "Dec 19", actual: 62000000, forecast: null },
  { date: "Dec 22", actual: 55000000, forecast: null },
  { date: "Dec 25", actual: 48000000, forecast: null },
  { date: "Dec 28", actual: 72000000, forecast: null },
  { date: "Dec 31", actual: 68000000, forecast: null },
  { date: "Jan 3", actual: 75000000, forecast: null },
  { date: "Jan 5", actual: 58000000, forecast: null },
  { date: "Jan 7", actual: 65000000, forecast: null },
  { date: "Jan 9", actual: 78000000, forecast: null },
  { date: "Jan 11", actual: 72000000, forecast: null },
  { date: "Jan 14", actual: 85000000, forecast: 85000000 },
  { date: "Jan 17", actual: null, forecast: 88000000 },
  { date: "Jan 21", actual: null, forecast: 92000000 },
];

export const transactionTrendStats = {
  totalVolume: transactionTrendData.filter(d => d.actual).reduce((sum, d) => sum + (d.actual || 0), 0),
  dailyAverage: transactionTrendData.filter(d => d.actual).reduce((sum, d) => sum + (d.actual || 0), 0) / transactionTrendData.filter(d => d.actual).length,
};

// Transaction volume chart data
export const transactionVolumeData = [
  { month: "Jan", volume: 4200, value: 125000000000 },
  { month: "Feb", volume: 3800, value: 98000000000 },
  { month: "Mar", volume: 5100, value: 156000000000 },
  { month: "Apr", volume: 4700, value: 142000000000 },
  { month: "May", volume: 5500, value: 178000000000 },
  { month: "Jun", volume: 6200, value: 195000000000 },
  { month: "Jul", volume: 5800, value: 184000000000 },
  { month: "Aug", volume: 6500, value: 212000000000 },
  { month: "Sep", volume: 7100, value: 245000000000 },
  { month: "Oct", volume: 6800, value: 228000000000 },
  { month: "Nov", volume: 7500, value: 267000000000 },
  { month: "Dec", volume: 8200, value: 298000000000 },
];

// Product mix data
export const productMixData = [
  { name: "Form M", value: 35, color: "#0ea5e9" },
  { name: "Import LC", value: 25, color: "#06b6d4" },
  { name: "Form A", value: 15, color: "#10b981" },
  { name: "BFC", value: 12, color: "#f59e0b" },
  { name: "FX Sales", value: 8, color: "#ec4899" },
  { name: "Others", value: 5, color: "#6366f1" },
];

// Status distribution
export const statusDistributionData = [
  { status: "Completed", count: mockTransactions.filter(t => t.status === "completed").length, color: "#10b981" },
  { status: "Pending", count: mockTransactions.filter(t => t.status === "pending").length, color: "#f59e0b" },
  { status: "Under Review", count: mockTransactions.filter(t => t.status === "under_review").length, color: "#3b82f6" },
  { status: "Exception", count: mockTransactions.filter(t => t.status === "exception").length, color: "#ef4444" },
];
