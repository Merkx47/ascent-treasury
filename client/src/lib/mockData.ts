// Treasury Solution Mock Data

// Nigerian First Names
const nigerianFirstNames = [
  "Adebayo", "Chidinma", "Oluwaseun", "Ngozi", "Chukwuemeka", "Fatima", "Ibrahim", "Aisha",
  "Olumide", "Blessing", "Emeka", "Funke", "Tunde", "Amara", "Obinna", "Yetunde",
  "Ifeanyi", "Titilayo", "Chinedu", "Folake", "Adaeze", "Kayode", "Nneka", "Babatunde",
];

const nigerianLastNames = [
  "Okonkwo", "Adeyemi", "Eze", "Mohammed", "Okafor", "Bello", "Nwosu", "Abubakar",
  "Okwu", "Yusuf", "Onyekachi", "Musa", "Igwe", "Suleiman", "Chukwu", "Abdullahi",
  "Akinwunmi", "Shehu", "Ogbonna", "Usman", "Oyelaran", "Ibrahim", "Anyanwu", "Hassan",
];

// Generate random Nigerian name
function generateNigerianName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = nigerianFirstNames[Math.floor(Math.random() * nigerianFirstNames.length)];
  const lastName = nigerianLastNames[Math.floor(Math.random() * nigerianLastNames.length)];
  return { firstName, lastName, fullName: `${firstName} ${lastName}` };
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
  return `${prefix}-${year}-${String(index).padStart(5, "0")}`;
}

// =============================================
// COUNTERPARTIES (Banks, Corporates, etc.)
// =============================================
export interface Counterparty {
  id: string;
  name: string;
  shortName: string;
  type: "BANK" | "CORP" | "GOVT" | "INSTIT" | "BROKER" | "CBN";
  country: string;
  swiftCode?: string;
  lei?: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  creditRating?: string;
  creditLimit: number;
  utilizationLimit: number;
  tradingLimit?: number;
  settlementLimit?: number;
  status: "active" | "inactive" | "suspended";
  relationshipManager: string;
}

export const mockCounterparties: Counterparty[] = [
  // Nigerian Banks
  { id: "cp-001", name: "Zenith Bank Plc", shortName: "ZENITH", type: "BANK", country: "Nigeria", swiftCode: "ZEABORLG", lei: "21380091Z8NX8CQWQG23", address: "84 Ajose Adeogun Street, Victoria Island, Lagos", contactPerson: "Treasury Desk", email: "treasury@zenithbank.com", phone: "+234-1-278-1600", creditRating: "AA-", creditLimit: 50000000000, utilizationLimit: 35000000000, tradingLimit: 50000000, settlementLimit: 100000000, status: "active", relationshipManager: "Adebayo Okonkwo" },
  { id: "cp-002", name: "First Bank of Nigeria Ltd", shortName: "FIRSTBANK", type: "BANK", country: "Nigeria", swiftCode: "FBNINGLA", lei: "21380091Z8NX8CQWQG24", address: "Samuel Asabia House, 35 Marina, Lagos", contactPerson: "Treasury Operations", email: "treasury@firstbanknigeria.com", phone: "+234-1-905-2000", creditRating: "A+", creditLimit: 45000000000, utilizationLimit: 28000000000, tradingLimit: 45000000, settlementLimit: 90000000, status: "active", relationshipManager: "Ngozi Eze" },
  { id: "cp-003", name: "Access Bank Plc", shortName: "ACCESS", type: "BANK", country: "Nigeria", swiftCode: "ABABORLG", lei: "21380091Z8NX8CQWQG25", address: "999c Danmole Street, Victoria Island, Lagos", contactPerson: "FX Desk", email: "treasury@accessbankplc.com", phone: "+234-1-280-5000", creditRating: "AA-", creditLimit: 40000000000, utilizationLimit: 22000000000, tradingLimit: 40000000, settlementLimit: 80000000, status: "active", relationshipManager: "Chukwuemeka Okafor" },
  { id: "cp-004", name: "Guaranty Trust Bank Ltd", shortName: "GTB", type: "BANK", country: "Nigeria", swiftCode: "GTBINGLA", lei: "21380091Z8NX8CQWQG26", address: "635 Akin Adesola Street, Victoria Island, Lagos", contactPerson: "Dealing Room", email: "treasury@gtbank.com", phone: "+234-1-448-0000", creditRating: "AA", creditLimit: 55000000000, utilizationLimit: 40000000000, tradingLimit: 55000000, settlementLimit: 110000000, status: "active", relationshipManager: "Fatima Bello" },
  { id: "cp-005", name: "United Bank for Africa Plc", shortName: "UBA", type: "BANK", country: "Nigeria", swiftCode: "UNABORLG", lei: "21380091Z8NX8CQWQG27", address: "57 Marina, Lagos Island, Lagos", contactPerson: "Treasury Sales", email: "treasury@ubagroup.com", phone: "+234-1-280-8000", creditRating: "A+", creditLimit: 35000000000, utilizationLimit: 18000000000, tradingLimit: 35000000, settlementLimit: 70000000, status: "active", relationshipManager: "Ibrahim Musa" },
  { id: "cp-006", name: "Stanbic IBTC Bank", shortName: "STANBIC", type: "BANK", country: "Nigeria", swiftCode: "SBICNGLA", lei: "21380091Z8NX8CQWQG28", address: "Walter Carrington Crescent, Victoria Island, Lagos", contactPerson: "Global Markets", email: "globalmarkets@stanbicibtc.com", phone: "+234-1-422-2222", creditRating: "AA", creditLimit: 42000000000, utilizationLimit: 30000000000, tradingLimit: 42000000, settlementLimit: 84000000, status: "active", relationshipManager: "Aisha Yusuf" },
  { id: "cp-007", name: "Fidelity Bank Plc", shortName: "FIDELITY", type: "BANK", country: "Nigeria", swiftCode: "FIDTNGLA", lei: "21380091Z8NX8CQWQG29", address: "2 Kofo Abayomi Street, Victoria Island, Lagos", contactPerson: "Treasury Desk", email: "treasury@fidelitybank.ng", phone: "+234-1-448-5252", creditRating: "A", creditLimit: 25000000000, utilizationLimit: 15000000000, tradingLimit: 25000000, settlementLimit: 50000000, status: "active", relationshipManager: "Emeka Nwosu" },
  { id: "cp-008", name: "Ecobank Nigeria Ltd", shortName: "ECOBANK", type: "BANK", country: "Nigeria", swiftCode: "EABORLG", lei: "21380091Z8NX8CQWQG30", address: "21 Ahmadu Bello Way, Victoria Island, Lagos", contactPerson: "Treasury Operations", email: "treasuryng@ecobank.com", phone: "+234-1-277-2000", creditRating: "A+", creditLimit: 30000000000, utilizationLimit: 20000000000, tradingLimit: 30000000, settlementLimit: 60000000, status: "active", relationshipManager: "Funke Adeyemi" },
  // International Banks
  { id: "cp-009", name: "Citibank Nigeria Ltd", shortName: "CITI", type: "BANK", country: "Nigeria", swiftCode: "CITINGLA", lei: "6SHGI4ZSSLCXXQSBB395", address: "27 Kofo Abayomi Street, Victoria Island, Lagos", contactPerson: "Markets Team", email: "markets.nigeria@citi.com", phone: "+234-1-279-6000", creditRating: "AAA", creditLimit: 100000000000, utilizationLimit: 60000000000, tradingLimit: 100000000, settlementLimit: 200000000, status: "active", relationshipManager: "Tunde Mohammed" },
  { id: "cp-010", name: "Standard Chartered Bank Nigeria", shortName: "SCBN", type: "BANK", country: "Nigeria", swiftCode: "SCBLNGLA", lei: "U4LOSZCWYFMRQ1Q2FZ26", address: "142 Ahmadu Bello Way, Victoria Island, Lagos", contactPerson: "Financial Markets", email: "financialmarkets.ng@sc.com", phone: "+234-1-236-0000", creditRating: "AA+", creditLimit: 80000000000, utilizationLimit: 55000000000, tradingLimit: 80000000, settlementLimit: 160000000, status: "active", relationshipManager: "Amara Suleiman" },
  // Government
  { id: "cp-011", name: "Central Bank of Nigeria", shortName: "CBN", type: "CBN", country: "Nigeria", swiftCode: "CBNINGLA", address: "Central Business District, Abuja FCT", contactPerson: "Financial Markets Department", email: "fmd@cbn.gov.ng", phone: "+234-9-462-3000", creditRating: "Sovereign", creditLimit: 500000000000, utilizationLimit: 200000000000, tradingLimit: 500000000, settlementLimit: 1000000000, status: "active", relationshipManager: "Obinna Chukwu" },
  { id: "cp-012", name: "Debt Management Office", shortName: "DMO", type: "GOVT", country: "Nigeria", address: "NNPC Towers, Herbert Macaulay Way, Abuja", contactPerson: "Debt Strategy", email: "enquiries@dmo.gov.ng", phone: "+234-9-290-4700", creditRating: "Sovereign", creditLimit: 300000000000, utilizationLimit: 150000000000, tradingLimit: 300000000, settlementLimit: 600000000, status: "active", relationshipManager: "Yetunde Abdullahi" },
  // Corporates
  { id: "cp-013", name: "Dangote Industries Ltd", shortName: "DANGOTE", type: "CORP", country: "Nigeria", address: "1 Alfred Rewane Road, Ikoyi, Lagos", contactPerson: "Treasury Department", email: "treasury@dangote.com", phone: "+234-1-448-0815", creditRating: "AA-", creditLimit: 20000000000, utilizationLimit: 12000000000, tradingLimit: 20000000, settlementLimit: 40000000, status: "active", relationshipManager: "Ifeanyi Akinwunmi" },
  { id: "cp-014", name: "MTN Nigeria Communications Plc", shortName: "MTN", type: "CORP", country: "Nigeria", lei: "5299007OJKGP1QMQOM81", address: "Golden Plaza, Falomo, Ikoyi, Lagos", contactPerson: "Finance Team", email: "treasury@mtnnigeria.net", phone: "+234-1-702-0000", creditRating: "AA", creditLimit: 25000000000, utilizationLimit: 18000000000, tradingLimit: 25000000, settlementLimit: 50000000, status: "active", relationshipManager: "Titilayo Shehu" },
  { id: "cp-015", name: "Shell Petroleum Development", shortName: "SHELL", type: "CORP", country: "Nigeria", lei: "21380068P1DRHMJ8KU70", address: "Freeman House, 21/22 Marina, Lagos", contactPerson: "Treasury Operations", email: "treasury@shell.com.ng", phone: "+234-1-277-0000", creditRating: "AAA", creditLimit: 50000000000, utilizationLimit: 35000000000, tradingLimit: 50000000, settlementLimit: 100000000, status: "active", relationshipManager: "Chinedu Ogbonna" },
];

// =============================================
// FX DEALS
// =============================================
export interface FxDeal {
  id: string;
  dealNumber: string;
  tradeType: "spot" | "forward" | "ndf" | "swap";
  buyCurrency: string;
  sellCurrency: string;
  buyAmount: number;
  sellAmount: number;
  rate: number;
  spotRate: number;
  forwardPoints?: number;
  counterpartyId: string;
  counterpartyName: string;
  tradeDate: Date;
  valueDate: Date;
  maturityDate?: Date;
  dealerName: string;
  status: "pending" | "verified" | "confirmed" | "settled" | "cancelled" | "matured";
  settlementStatus: "unsettled" | "partially_settled" | "settled";
  createdAt: Date;
  updatedAt: Date;
}

const fxTradeTypes = ["spot", "forward", "ndf", "swap"] as const;
const fxStatuses = ["pending", "verified", "confirmed", "settled"] as const;

export const mockFxDeals: FxDeal[] = Array.from({ length: 150 }, (_, i) => {
  const tradeType = fxTradeTypes[i % fxTradeTypes.length];
  const counterparty = mockCounterparties[i % mockCounterparties.length];
  const dealer = generateNigerianName();
  const isBuy = Math.random() > 0.5;

  const baseRate = 1580 + Math.random() * 20;
  const forwardPoints = tradeType === "forward" || tradeType === "swap" ? Math.random() * 50 - 25 : 0;
  const rate = baseRate + forwardPoints;
  const usdAmount = Math.floor(Math.random() * 10000000) + 100000;

  const tradeDate = generateDate(60, 0);
  const valueDateOffset = tradeType === "spot" ? 2 : tradeType === "forward" ? Math.floor(Math.random() * 180) + 30 : 2;
  const valueDate = new Date(tradeDate.getTime() + valueDateOffset * 24 * 60 * 60 * 1000);

  return {
    id: `fx-${String(i + 1).padStart(5, "0")}`,
    dealNumber: generateRef("FX", i + 1),
    tradeType,
    buyCurrency: isBuy ? "NGN" : "USD",
    sellCurrency: isBuy ? "USD" : "NGN",
    buyAmount: isBuy ? usdAmount * rate : usdAmount,
    sellAmount: isBuy ? usdAmount : usdAmount * rate,
    rate,
    spotRate: baseRate,
    forwardPoints: forwardPoints !== 0 ? forwardPoints : undefined,
    counterpartyId: counterparty.id,
    counterpartyName: counterparty.shortName,
    tradeDate,
    valueDate,
    maturityDate: tradeType === "swap" ? new Date(valueDate.getTime() + 90 * 24 * 60 * 60 * 1000) : undefined,
    dealerName: dealer.fullName,
    status: fxStatuses[Math.floor(Math.random() * fxStatuses.length)],
    settlementStatus: Math.random() > 0.3 ? "settled" : "unsettled",
    createdAt: tradeDate,
    updatedAt: generateDate(30, 0),
  };
});

// =============================================
// MONEY MARKET DEALS
// =============================================
export interface MoneyMarketDeal {
  id: string;
  dealNumber: string;
  dealType: "deposit" | "loan" | "tbill" | "call_notice";
  direction: "placed" | "taken";
  principal: number;
  currency: string;
  rate: number;
  rateType: "fixed" | "floating";
  benchmark?: string;
  spread?: number;
  startDate: Date;
  maturityDate: Date;
  tenor: string;
  tenorDays: number;
  counterpartyId: string;
  counterpartyName: string;
  dealerName: string;
  interest: number;
  status: "pending" | "verified" | "confirmed" | "active" | "matured" | "cancelled";
  createdAt: Date;
}

const mmDealTypes = ["deposit", "loan", "tbill", "call_notice"] as const;
const mmStatuses = ["pending", "verified", "confirmed", "active", "matured"] as const;
const tenors = ["ON", "1W", "2W", "1M", "2M", "3M", "6M", "9M", "1Y"];
const tenorDaysMap: Record<string, number> = { ON: 1, "1W": 7, "2W": 14, "1M": 30, "2M": 60, "3M": 90, "6M": 180, "9M": 270, "1Y": 365 };

export const mockMoneyMarketDeals: MoneyMarketDeal[] = Array.from({ length: 100 }, (_, i) => {
  const dealType = mmDealTypes[i % mmDealTypes.length];
  const counterparty = mockCounterparties.filter(c => c.type === "BANK" || c.type === "CBN")[i % 10];
  const dealer = generateNigerianName();
  const tenor = tenors[i % tenors.length];
  const tenorDays = tenorDaysMap[tenor];

  const isNGN = Math.random() > 0.3;
  const principal = isNGN ? Math.floor(Math.random() * 50000000000) + 1000000000 : Math.floor(Math.random() * 20000000) + 1000000;
  const rate = dealType === "tbill" ? 15 + Math.random() * 5 : 18 + Math.random() * 8;

  const startDate = generateDate(90, 0);
  const maturityDate = new Date(startDate.getTime() + tenorDays * 24 * 60 * 60 * 1000);
  const interest = (principal * rate * tenorDays) / (365 * 100);

  return {
    id: `mm-${String(i + 1).padStart(5, "0")}`,
    dealNumber: generateRef("MM", i + 1),
    dealType,
    direction: Math.random() > 0.5 ? "placed" : "taken",
    principal,
    currency: isNGN ? "NGN" : "USD",
    rate,
    rateType: dealType === "call_notice" ? "floating" : "fixed",
    benchmark: dealType === "call_notice" ? "NIBOR" : undefined,
    spread: dealType === "call_notice" ? 0.5 : undefined,
    startDate,
    maturityDate,
    tenor,
    tenorDays,
    counterpartyId: counterparty.id,
    counterpartyName: counterparty.shortName,
    dealerName: dealer.fullName,
    interest,
    status: mmStatuses[Math.floor(Math.random() * mmStatuses.length)],
    createdAt: startDate,
  };
});

// =============================================
// FIXED INCOME (BONDS)
// =============================================
export interface BondHolding {
  id: string;
  bondId: string;
  isin: string;
  bondName: string;
  bondType: "government" | "corporate" | "eurobond";
  issuer: string;
  currency: string;
  faceValue: number;
  quantity: number;
  cleanPrice: number;
  dirtyPrice: number;
  accruedInterest: number;
  marketValue: number;
  couponRate: number;
  couponFrequency: "annual" | "semi-annual" | "quarterly";
  issueDate: Date;
  maturityDate: Date;
  nextCouponDate: Date;
  yield: number;
  duration: number;
  status: "active" | "matured" | "sold";
  purchaseDate: Date;
  purchasePrice: number;
}

const bondTypes = ["government", "corporate", "eurobond"] as const;
const bondIssuers = [
  { name: "FGN Bond", type: "government" as const },
  { name: "Lagos State Bond", type: "government" as const },
  { name: "Access Bank Bond", type: "corporate" as const },
  { name: "Dangote Bond", type: "corporate" as const },
  { name: "Nigeria Eurobond", type: "eurobond" as const },
];

export const mockBondHoldings: BondHolding[] = Array.from({ length: 50 }, (_, i) => {
  const bond = bondIssuers[i % bondIssuers.length];
  const maturityYear = 2025 + Math.floor(Math.random() * 10);
  const couponRate = 10 + Math.random() * 8;
  const faceValue = Math.floor(Math.random() * 100000000000) + 1000000000;
  const cleanPrice = 95 + Math.random() * 15;
  const accruedInterest = (couponRate / 100) * faceValue * (Math.random() * 0.5) / 2;
  const dirtyPrice = cleanPrice + (accruedInterest / faceValue) * 100;

  return {
    id: `bond-${String(i + 1).padStart(4, "0")}`,
    bondId: `BOND-${maturityYear}-${String(i + 1).padStart(3, "0")}`,
    isin: `NGBOND${String(i + 1).padStart(6, "0")}`,
    bondName: `${bond.name} ${maturityYear} ${couponRate.toFixed(2)}%`,
    bondType: bond.type,
    issuer: bond.name.split(" ")[0],
    currency: bond.type === "eurobond" ? "USD" : "NGN",
    faceValue,
    quantity: Math.floor(faceValue / 1000),
    cleanPrice,
    dirtyPrice,
    accruedInterest,
    marketValue: faceValue * dirtyPrice / 100,
    couponRate,
    couponFrequency: "semi-annual",
    issueDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
    maturityDate: new Date(maturityYear, Math.floor(Math.random() * 12), 1),
    nextCouponDate: generateDate(0, 180),
    yield: couponRate + (100 - cleanPrice) / ((maturityYear - 2025) || 1),
    duration: (maturityYear - 2025) * 0.9,
    status: "active",
    purchaseDate: generateDate(365, 0),
    purchasePrice: cleanPrice - Math.random() * 5,
  };
});

// =============================================
// RISK METRICS
// =============================================
export interface RiskMetrics {
  id: string;
  date: Date;
  portfolioVar95: number;
  portfolioVar99: number;
  fxVar: number;
  irVar: number;
  totalPv01: number;
  fxPv01: number;
  irPv01: number;
  totalExposure: number;
  limitUtilization: number;
}

export const mockRiskMetrics: RiskMetrics[] = Array.from({ length: 30 }, (_, i) => ({
  id: `risk-${String(i + 1).padStart(3, "0")}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  portfolioVar95: 500000000 + Math.random() * 200000000,
  portfolioVar99: 750000000 + Math.random() * 300000000,
  fxVar: 300000000 + Math.random() * 150000000,
  irVar: 200000000 + Math.random() * 100000000,
  totalPv01: 50000000 + Math.random() * 20000000,
  fxPv01: 30000000 + Math.random() * 15000000,
  irPv01: 20000000 + Math.random() * 10000000,
  totalExposure: 150000000000 + Math.random() * 50000000000,
  limitUtilization: 60 + Math.random() * 25,
}));

// =============================================
// POSITIONS SUMMARY
// =============================================
export interface PositionSummary {
  id: string;
  productType: string;
  currency: string;
  longPosition: number;
  shortPosition: number;
  netPosition: number;
  avgRate: number;
  marketRate: number;
  unrealizedPnl: number;
  realizedPnl: number;
  lastUpdated: Date;
}

export const mockPositions: PositionSummary[] = [
  { id: "pos-001", productType: "FX Spot", currency: "USD", longPosition: 25000000, shortPosition: 18000000, netPosition: 7000000, avgRate: 1575.50, marketRate: 1580.25, unrealizedPnl: 33250000, realizedPnl: 125000000, lastUpdated: new Date() },
  { id: "pos-002", productType: "FX Spot", currency: "EUR", longPosition: 8000000, shortPosition: 5000000, netPosition: 3000000, avgRate: 1715.00, marketRate: 1722.50, unrealizedPnl: 22500000, realizedPnl: 45000000, lastUpdated: new Date() },
  { id: "pos-003", productType: "FX Spot", currency: "GBP", longPosition: 5000000, shortPosition: 3500000, netPosition: 1500000, avgRate: 1995.00, marketRate: 2002.00, unrealizedPnl: 10500000, realizedPnl: 28000000, lastUpdated: new Date() },
  { id: "pos-004", productType: "FX Forward", currency: "USD", longPosition: 15000000, shortPosition: 12000000, netPosition: 3000000, avgRate: 1590.00, marketRate: 1585.50, unrealizedPnl: -13500000, realizedPnl: 75000000, lastUpdated: new Date() },
  { id: "pos-005", productType: "Money Market", currency: "NGN", longPosition: 85000000000, shortPosition: 45000000000, netPosition: 40000000000, avgRate: 22.50, marketRate: 23.00, unrealizedPnl: 200000000, realizedPnl: 1500000000, lastUpdated: new Date() },
  { id: "pos-006", productType: "Money Market", currency: "USD", longPosition: 15000000, shortPosition: 8000000, netPosition: 7000000, avgRate: 5.25, marketRate: 5.50, unrealizedPnl: 17500, realizedPnl: 125000, lastUpdated: new Date() },
  { id: "pos-007", productType: "T-Bills", currency: "NGN", longPosition: 120000000000, shortPosition: 0, netPosition: 120000000000, avgRate: 17.50, marketRate: 18.00, unrealizedPnl: 600000000, realizedPnl: 2100000000, lastUpdated: new Date() },
  { id: "pos-008", productType: "Bonds", currency: "NGN", longPosition: 250000000000, shortPosition: 0, netPosition: 250000000000, avgRate: 98.50, marketRate: 99.25, unrealizedPnl: 1875000000, realizedPnl: 5200000000, lastUpdated: new Date() },
];

// =============================================
// SETTLEMENTS QUEUE
// =============================================
export interface Settlement {
  id: string;
  dealReference: string;
  dealType: string;
  counterparty: string;
  settlementDate: string;
  currency: string;
  amount: number;
  settlementType: "receive" | "pay" | "dvp";
  status: "pending" | "confirmed" | "settled" | "failed";
  ourAccount: string;
  theirAccount: string;
  paymentReference?: string;
}

const settlementTypes = ["receive", "pay", "dvp"] as const;
const settlementStatuses = ["pending", "confirmed", "settled", "failed"] as const;

export const mockSettlements: Settlement[] = Array.from({ length: 50 }, (_, i) => {
  const deal = mockFxDeals[i % mockFxDeals.length];
  const settType = settlementTypes[i % 3];
  const valueDate = deal.valueDate instanceof Date
    ? deal.valueDate.toISOString().split("T")[0]
    : deal.valueDate;

  return {
    id: `sett-${String(i + 1).padStart(4, "0")}`,
    dealReference: deal.dealNumber,
    dealType: "FX " + deal.tradeType.toUpperCase(),
    counterparty: deal.counterpartyName,
    settlementDate: valueDate,
    currency: settType === "receive" ? "USD" : "NGN",
    amount: settType === "receive" ? deal.buyAmount : deal.sellAmount,
    settlementType: settType,
    status: settlementStatuses[Math.floor(Math.random() * 4)],
    ourAccount: settType === "receive" ? "CITI-USD-001" : "CBN-NGN-001",
    theirAccount: deal.counterpartyName.substring(0, 8).toUpperCase() + "-001",
    paymentReference: Math.random() > 0.5 ? `REF-${Date.now()}-${i}` : undefined,
  };
});

// =============================================
// DASHBOARD AGGREGATION
// =============================================
export const treasuryDashboardStats = {
  totalFxVolume: mockFxDeals.reduce((sum, d) => sum + (d.buyCurrency === "USD" ? d.buyAmount : d.sellAmount), 0),
  fxDealsToday: mockFxDeals.filter(d => d.tradeDate.toDateString() === new Date().toDateString()).length,
  mmOutstanding: mockMoneyMarketDeals.filter(d => d.status === "active").reduce((sum, d) => sum + d.principal, 0),
  bondPortfolioValue: mockBondHoldings.reduce((sum, b) => sum + b.marketValue, 0),
  portfolioVar95: mockRiskMetrics[0]?.portfolioVar95 || 0,
  totalPnl: mockPositions.reduce((sum, p) => sum + p.unrealizedPnl + p.realizedPnl, 0),
  pendingSettlements: mockSettlements.filter(s => s.status === "pending").length,
  limitUtilization: mockRiskMetrics[0]?.limitUtilization || 0,
};

// FX Rates for live display
export const fxRates = [
  { pair: "USD/NGN", bid: 1578.50, ask: 1582.50, change: 0.15, flag: "us" },
  { pair: "EUR/NGN", bid: 1720.25, ask: 1725.75, change: -0.08, flag: "eu" },
  { pair: "GBP/NGN", bid: 1998.00, ask: 2004.50, change: 0.22, flag: "gb" },
  { pair: "CNY/NGN", bid: 218.50, ask: 220.25, change: -0.12, flag: "cn" },
  { pair: "CHF/NGN", bid: 1745.00, ask: 1752.00, change: 0.05, flag: "ch" },
  { pair: "JPY/NGN", bid: 10.45, ask: 10.55, change: -0.03, flag: "jp" },
  { pair: "ZAR/NGN", bid: 85.50, ask: 86.25, change: 0.08, flag: "za" },
];

// Interest Rate Benchmarks
export const interestRates = [
  { name: "NIBOR O/N", rate: 25.50, change: 0.25 },
  { name: "NIBOR 1M", rate: 26.75, change: 0.15 },
  { name: "NIBOR 3M", rate: 27.50, change: 0.10 },
  { name: "MPR", rate: 27.50, change: 0.00 },
  { name: "T-Bill 91D", rate: 17.50, change: -0.05 },
  { name: "T-Bill 182D", rate: 18.25, change: 0.00 },
  { name: "T-Bill 364D", rate: 19.00, change: 0.10 },
];

// P&L Trend Data
export const pnlTrendData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  fxPnl: Math.floor(Math.random() * 200000000) - 50000000,
  mmPnl: Math.floor(Math.random() * 100000000) + 20000000,
  bondPnl: Math.floor(Math.random() * 150000000) + 50000000,
  totalPnl: 0,
})).map(d => ({ ...d, totalPnl: d.fxPnl + d.mmPnl + d.bondPnl }));

// =============================================
// MOCK USERS (Treasury-specific roles)
// =============================================
export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  branch: string;
  role: string;
  status: string;
  permissions: string[];
  dailyLimit: number;
  approvalLimit: number;
  lastLoginAt: Date | null;
  createdAt: Date;
}

const treasuryDepartments = [
  "Treasury Front Office", "Treasury Middle Office", "Treasury Back Office",
  "Risk Management", "Compliance", "Operations"
];

const treasuryRoles = [
  "FX Dealer", "MM Dealer", "Fixed Income Dealer", "Senior Dealer",
  "Chief Dealer", "Treasury Operations", "Risk Analyst", "Checker"
];

export const mockUsers: MockUser[] = Array.from({ length: 25 }, (_, i) => {
  const name = generateNigerianName();
  const role = treasuryRoles[i % treasuryRoles.length];
  const department = treasuryDepartments[i % treasuryDepartments.length];
  const status = i < 22 ? "Active" : ["Inactive", "Suspended", "Pending Activation"][i % 3];

  return {
    id: `user-${String(i + 1).padStart(3, "0")}`,
    firstName: name.firstName,
    lastName: name.lastName,
    email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@unionbank.com`,
    phone: `+234 ${Math.floor(Math.random() * 9) + 1}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
    employeeId: `UBN-TR-${String(i + 1).padStart(3, "0")}`,
    department,
    branch: "Head Office - Treasury",
    role,
    status,
    permissions: [],
    dailyLimit: (i + 1) * 100000000,
    approvalLimit: (i + 1) * 50000000,
    lastLoginAt: status === "Active" ? generateDate(7, 0) : null,
    createdAt: generateDate(365, 0),
  };
});

// =============================================
// CHECKER QUEUE
// =============================================
export interface MockCheckerQueueItem {
  id: string;
  entityType: string;
  entityId: string;
  referenceNumber: string;
  action: "create" | "update" | "delete";
  status: "pending" | "approved" | "rejected" | "sent_back";
  priority: "normal" | "high" | "urgent";
  makerId: string;
  makerName: string;
  makerDepartment: string;
  makerComments: string;
  submittedAt: Date;
  checkerId: string | null;
  checkerName: string | null;
  checkerComments: string | null;
  checkedAt: Date | null;
  customerName: string;
  amount: string;
  currency: string;
  description: string;
}

const queueEntityTypes = ["FXSPOT", "FXFORWARD", "FXSWAP", "MMDEPOSIT", "MMLOAN", "TBILL", "BOND"];
const queueStatuses = ["pending", "pending", "pending", "approved", "rejected", "sent_back"] as const;
const queuePriorities = ["normal", "normal", "high", "urgent"] as const;

export const mockCheckerQueue: MockCheckerQueueItem[] = Array.from({ length: 45 }, (_, i) => {
  const entityType = queueEntityTypes[i % queueEntityTypes.length];
  const maker = mockUsers[i % mockUsers.length];
  const checker = Math.random() > 0.5 ? mockUsers[(i + 5) % mockUsers.length] : null;
  const counterparty = mockCounterparties[i % mockCounterparties.length];
  const status = queueStatuses[i % queueStatuses.length];
  const deal = mockFxDeals[i % mockFxDeals.length];

  return {
    id: `queue-${String(i + 1).padStart(3, "0")}`,
    entityType,
    entityId: deal.id,
    referenceNumber: deal.dealNumber,
    action: "create",
    status,
    priority: queuePriorities[i % queuePriorities.length],
    makerId: maker.id,
    makerName: `${maker.firstName} ${maker.lastName}`,
    makerDepartment: maker.department,
    makerComments: i % 3 === 0 ? "Urgent client request" : "",
    submittedAt: generateDate(5, 0),
    checkerId: status !== "pending" && checker ? checker.id : null,
    checkerName: status !== "pending" && checker ? `${checker.firstName} ${checker.lastName}` : null,
    checkerComments: status === "rejected" ? "Rate not within tolerance" : status === "sent_back" ? "Please verify counterparty limit" : null,
    checkedAt: status !== "pending" ? generateDate(2, 0) : null,
    customerName: counterparty.name,
    amount: String(deal.buyAmount),
    currency: deal.buyCurrency,
    description: `${deal.tradeType.toUpperCase()} ${deal.buyCurrency}/${deal.sellCurrency}`,
  };
});

// Helper functions
export function getCounterpartyById(id: string): Counterparty | undefined {
  return mockCounterparties.find((c) => c.id === id);
}

export function getFxDealById(id: string): FxDeal | undefined {
  return mockFxDeals.find((d) => d.id === id);
}

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getPendingQueueCount(): number {
  return mockCheckerQueue.filter((item) => item.status === "pending").length;
}

// Alias exports for pages
export const counterparties = mockCounterparties;
export const fxDeals = mockFxDeals;
export const moneyMarketDeals = mockMoneyMarketDeals;
export const bondHoldings = mockBondHoldings;
export const riskMetrics = mockRiskMetrics;
export const positionSummary = mockPositions;
export const settlements = mockSettlements;
export const checkerQueue = mockCheckerQueue;
export const users = mockUsers;

// Notifications for Treasury
export const mockNotifications = Array.from({ length: 20 }, (_, i) => ({
  id: `notif-${String(i + 1).padStart(3, "0")}`,
  title: ["FX Deal Executed", "Settlement Due", "Limit Breach Warning", "Bond Coupon Payment", "Rate Alert", "Checker Approval Required"][i % 6],
  message: [
    "FX Spot deal FX-2026-001234 executed at 1580.50",
    "Settlement for MM-2026-000456 due today",
    "FX open position limit at 92% utilization",
    "Coupon payment for FGN 2029 due in 3 days",
    "USD/NGN rate moved 2% from morning fixing",
    "3 items pending checker approval in queue",
  ][i % 6],
  type: ["success", "warning", "alert", "info", "info", "warning"][i % 6] as "success" | "warning" | "alert" | "info",
  read: i > 4,
  createdAt: new Date(Date.now() - i * 3600000),
}));

// Legacy exports for compatibility
export const mockCustomers = mockCounterparties;
export const mockFxTrades = mockFxDeals.map(d => ({
  id: d.id,
  transactionId: d.id,
  tradeReference: d.dealNumber,
  tradeType: d.tradeType,
  buyCurrency: d.buyCurrency,
  sellCurrency: d.sellCurrency,
  buyAmount: String(d.buyAmount),
  sellAmount: String(d.sellAmount),
  spotRate: String(d.spotRate),
  allInRate: String(d.rate),
  valueDate: d.valueDate,
  counterparty: d.counterpartyName,
  dealerName: d.dealerName,
  settlementStatus: d.status === "settled" ? "completed" : "pending",
}));
export type MockFxTrade = typeof mockFxTrades[number];
