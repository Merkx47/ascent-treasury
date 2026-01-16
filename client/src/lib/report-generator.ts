import { format } from "date-fns";
import * as XLSX from "xlsx";

// Sample data generators
const customers = [
  "Dangote Industries Ltd",
  "Nigerian Breweries Plc",
  "Flour Mills of Nigeria",
  "PZ Cussons Nigeria Plc",
  "Nestle Nigeria Plc",
  "Unilever Nigeria Plc",
  "Lafarge Africa Plc",
  "BUA Group",
  "Honeywell Flour Mills",
  "Cadbury Nigeria Plc",
  "MTN Nigeria Communications",
  "Access Bank Plc",
  "Guaranty Trust Bank",
  "Zenith Bank Plc",
  "First Bank of Nigeria",
  "Nigerian National Petroleum Corporation",
  "Shell Petroleum Development",
  "Total Nigeria Plc",
  "Oando Plc",
  "Julius Berger Nigeria",
];

const products = ["Form M", "Form A", "Import LC", "Form NXP", "BFC", "Trade Loan", "Export LC", "Bank Guarantee"];
const currencies = ["USD", "EUR", "GBP", "NGN", "CNY", "JPY"];
const statuses = ["Approved", "Pending", "Completed", "Processing", "Validated", "Under Review"];
const branches = ["Victoria Island", "Marina", "Ikeja", "Abuja FCT", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Kaduna", "Calabar"];
const purposes = ["Raw Materials Import", "Machinery & Equipment", "Spare Parts", "Finished Goods", "Medical Supplies", "Educational Materials", "Technology Equipment", "Agricultural Inputs"];
const beneficiaries = ["ABC Trading Co. Ltd", "Global Exports International", "Tech Solutions Inc", "Industrial Supply Corp", "Premium Goods LLC", "Pacific Trading House", "European Suppliers AG", "Asian Manufacturing Co"];

const generateRandomDate = (year: number = 2025) => {
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
};

const generateReference = (prefix: string, index: number) => {
  return `${prefix}${format(new Date(), "yyyy")}${String(1000 + index).padStart(6, "0")}`;
};

// Generate detailed Form M data
const generateFormMData = (count: number = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    "Form M Number": generateReference("FM", i),
    "BA Number": generateReference("BA", i),
    "Applicant": customers[i % customers.length],
    "Applicant Account": `001${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
    "Beneficiary": beneficiaries[i % beneficiaries.length],
    "Beneficiary Country": ["China", "Germany", "USA", "UK", "Netherlands", "India", "Japan"][i % 7],
    "Currency": currencies[i % currencies.length],
    "Amount": Math.floor(Math.random() * 500000000) + 10000000,
    "NGN Equivalent": Math.floor(Math.random() * 750000000000) + 15000000000,
    "Purpose": purposes[i % purposes.length],
    "HS Code": `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 90) + 10}`,
    "Product Description": ["Industrial Machinery", "Raw Materials", "Spare Parts", "Electronics", "Chemicals"][i % 5],
    "Shipping Terms": ["CIF", "FOB", "CFR", "EXW"][i % 4],
    "Port of Discharge": ["Lagos (Apapa)", "Lagos (Tin Can)", "Port Harcourt", "Calabar"][i % 4],
    "Validity Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Expiry Date": format(new Date(2025, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd"),
    "Status": statuses[i % statuses.length],
    "Approval Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Approved By": ["Adebayo Ogunlesi", "Chika Nwosu", "Ibrahim Musa", "Folake Adeyemi"][i % 4],
    "Processing Branch": branches[i % branches.length],
    "Relationship Manager": ["John Okafor", "Mary Adamu", "Peter Bello", "Grace Eze"][i % 4],
    "Created Date": format(generateRandomDate(), "yyyy-MM-dd HH:mm:ss"),
    "Last Modified": format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  }));
};

// Generate detailed Form A data
const generateFormAData = (count: number = 50) => {
  const formAPurposes = ["School Fees", "Medical Bills", "Business Services", "Travel Allowance", "Maintenance", "Technical Fees", "Software License", "Professional Services"];
  return Array.from({ length: count }, (_, i) => ({
    "Form A Number": generateReference("FA", i),
    "Transaction Reference": generateReference("TXN", i),
    "Applicant": customers[i % customers.length],
    "Applicant Account": `001${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
    "Beneficiary Name": beneficiaries[i % beneficiaries.length],
    "Beneficiary Bank": ["Citibank", "HSBC", "Barclays", "Deutsche Bank", "BNP Paribas"][i % 5],
    "Beneficiary Country": ["UK", "USA", "Germany", "Canada", "Australia"][i % 5],
    "Currency": ["USD", "GBP", "EUR"][i % 3],
    "Amount": Math.floor(Math.random() * 100000) + 5000,
    "NGN Equivalent": Math.floor(Math.random() * 150000000) + 7500000,
    "Purpose": formAPurposes[i % formAPurposes.length],
    "Purpose Code": ["TA", "BTS", "MED", "EDU", "MNT"][i % 5],
    "Supporting Document": ["Invoice", "Admission Letter", "Medical Report", "Contract"][i % 4],
    "Value Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Status": statuses[i % statuses.length],
    "Approved By": ["Adebayo Ogunlesi", "Chika Nwosu", "Ibrahim Musa"][i % 3],
    "Processing Branch": branches[i % branches.length],
    "Created Date": format(generateRandomDate(), "yyyy-MM-dd HH:mm:ss"),
  }));
};

// Generate detailed LC data
const generateLCData = (count: number = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    "LC Reference": generateReference("LC", i),
    "Form M Reference": generateReference("FM", i),
    "LC Type": ["Irrevocable", "Confirmed", "Transferable", "Revolving"][i % 4],
    "Applicant": customers[i % customers.length],
    "Applicant Account": `001${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
    "Beneficiary": beneficiaries[i % beneficiaries.length],
    "Advising Bank": ["Citibank", "HSBC", "Standard Chartered", "Deutsche Bank"][i % 4],
    "Confirming Bank": ["BNP Paribas", "JPMorgan", "Bank of America", "Barclays"][i % 4],
    "Currency": currencies[i % currencies.length],
    "Amount": Math.floor(Math.random() * 500000000) + 50000000,
    "Tolerance (+/-)": "5%",
    "Goods Description": ["Industrial Equipment", "Raw Materials", "Machinery Parts", "Consumer Goods"][i % 4],
    "Port of Loading": ["Shanghai", "Rotterdam", "Hamburg", "Singapore"][i % 4],
    "Port of Discharge": ["Lagos (Apapa)", "Lagos (Tin Can)", "Port Harcourt"][i % 3],
    "Latest Shipment Date": format(new Date(2025, Math.floor(Math.random() * 6) + 3, Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd"),
    "Expiry Date": format(new Date(2025, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd"),
    "Days to Expiry": Math.floor(Math.random() * 180) + 30,
    "Tenor": ["At Sight", "30 Days", "60 Days", "90 Days", "180 Days"][i % 5],
    "Margin Held": Math.floor(Math.random() * 50000000) + 5000000,
    "Commission Rate": `${(Math.random() * 0.5 + 0.1).toFixed(2)}%`,
    "Status": statuses[i % statuses.length],
    "Issued Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Processing Branch": branches[i % branches.length],
  }));
};

// Generate FX Trading data
const generateFXData = (count: number = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    "Deal Reference": generateReference("FX", i),
    "Deal Type": ["Spot", "Forward", "Swap"][i % 3],
    "Customer": customers[i % customers.length],
    "Customer Account": `001${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
    "Buy Currency": ["USD", "EUR", "GBP"][i % 3],
    "Buy Amount": Math.floor(Math.random() * 10000000) + 100000,
    "Sell Currency": "NGN",
    "Sell Amount": Math.floor(Math.random() * 15000000000) + 150000000,
    "Exchange Rate": (1500 + Math.random() * 100).toFixed(4),
    "Value Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Maturity Date": format(new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd"),
    "Purpose": ["Import Payment", "Invisibles", "Capital Repatriation", "Dividend Payment"][i % 4],
    "Related Reference": generateReference("FM", i),
    "Dealer": ["Treasury Desk 1", "Treasury Desk 2", "Corporate FX"][i % 3],
    "Status": statuses[i % statuses.length],
    "Settlement Status": ["Settled", "Pending", "Partial"][i % 3],
    "Trade Date": format(generateRandomDate(), "yyyy-MM-dd HH:mm:ss"),
    "Processing Branch": branches[i % branches.length],
  }));
};

// Generate Compliance/Regulatory data
const generateComplianceData = (count: number = 50) => {
  const lists = ["OFAC SDN", "UN Sanctions", "EU Sanctions", "Local PEP", "World Check"];
  const results = ["No Match", "Potential Match", "False Positive", "Escalated", "Cleared"];
  return Array.from({ length: count }, (_, i) => ({
    "Screening Reference": generateReference("SCR", i),
    "Screening Date": format(generateRandomDate(), "yyyy-MM-dd HH:mm:ss"),
    "Customer Name": customers[i % customers.length],
    "Customer ID": `CUS${String(Math.floor(Math.random() * 900000) + 100000)}`,
    "Screening Type": ["New Customer", "Transaction", "Periodic Review", "Event Triggered"][i % 4],
    "Lists Checked": lists.slice(0, (i % 5) + 1).join(", "),
    "Match Score": Math.floor(Math.random() * 100),
    "Result": results[i % results.length],
    "Risk Level": ["Low", "Medium", "High", "Critical"][i % 4],
    "Matched Name": i % 3 === 1 ? "Similar Name Found" : "N/A",
    "Action Taken": ["Cleared", "Enhanced Due Diligence", "Escalated to Compliance", "Account Blocked"][i % 4],
    "Reviewed By": ["Compliance Officer 1", "Compliance Officer 2", "AML Analyst"][i % 3],
    "Review Date": format(generateRandomDate(), "yyyy-MM-dd"),
    "Comments": ["No issues identified", "Requires monitoring", "Cleared after review", "Escalated for approval"][i % 4],
    "Next Review Date": format(new Date(2025, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd"),
  }));
};

// Generate CBN Returns data
const generateCBNData = () => {
  const formMSummary = generateFormMData(30);
  const fxUtilization = currencies.slice(0, 4).map((currency) => ({
    "Currency": currency,
    "Allocation": Math.floor(Math.random() * 100000000) + 10000000,
    "Utilized": Math.floor(Math.random() * 80000000) + 8000000,
    "Balance": Math.floor(Math.random() * 20000000) + 2000000,
    "Utilization Rate": `${(70 + Math.random() * 25).toFixed(1)}%`,
    "Week Number": `W${Math.floor(Math.random() * 52) + 1}`,
  }));
  const outstandingLCs = generateLCData(20).map((lc) => ({
    ...lc,
    "Outstanding Amount": Math.floor(Math.random() * 200000000) + 20000000,
    "Margin Balance": Math.floor(Math.random() * 50000000) + 5000000,
  }));
  return { formMSummary, fxUtilization, outstandingLCs };
};

// Generate MIS Analytics data
const generateMISData = () => {
  const volumeByProduct = products.map((product) => ({
    "Product": product,
    "Transaction Count": Math.floor(Math.random() * 500) + 50,
    "Total Volume (NGN)": Math.floor(Math.random() * 500000000000) + 50000000000,
    "Average Value": Math.floor(Math.random() * 500000000) + 50000000,
    "Share of Total": `${(Math.random() * 25 + 5).toFixed(1)}%`,
    "YoY Growth": `${(Math.random() * 30 - 10).toFixed(1)}%`,
    "MoM Growth": `${(Math.random() * 15 - 5).toFixed(1)}%`,
  }));

  const branchPerformance = branches.map((branch) => ({
    "Branch": branch,
    "Total Transactions": Math.floor(Math.random() * 1000) + 100,
    "Total Volume (NGN)": Math.floor(Math.random() * 200000000000) + 20000000000,
    "Fee Income (NGN)": Math.floor(Math.random() * 500000000) + 50000000,
    "Active Customers": Math.floor(Math.random() * 500) + 50,
    "Staff Count": Math.floor(Math.random() * 30) + 5,
    "Avg Processing Time (Days)": (Math.random() * 3 + 1).toFixed(1),
    "SLA Compliance": `${(85 + Math.random() * 15).toFixed(1)}%`,
  }));

  const customerAnalysis = customers.slice(0, 15).map((customer, i) => ({
    "Customer Name": customer,
    "Customer ID": `CUS${String(Math.floor(Math.random() * 900000) + 100000)}`,
    "Segment": ["Corporate", "Commercial", "SME"][i % 3],
    "Total Transactions": Math.floor(Math.random() * 200) + 20,
    "Total Volume (NGN)": Math.floor(Math.random() * 100000000000) + 10000000000,
    "Revenue Generated": Math.floor(Math.random() * 100000000) + 10000000,
    "Products Used": Math.floor(Math.random() * 6) + 2,
    "Relationship Since": format(new Date(2015 + (i % 10), i % 12, 1), "yyyy-MM"),
    "Risk Rating": ["Low", "Medium", "Low", "Medium", "High"][i % 5],
  }));

  return { volumeByProduct, branchPerformance, customerAnalysis };
};

// Main export functions
const createWorkbook = (sheets: { name: string; data: Record<string, unknown>[] }[], metadata: Record<string, string>) => {
  const wb = XLSX.utils.book_new();

  // Add data sheets
  sheets.forEach((sheet) => {
    if (sheet.data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      // Auto-size columns
      const cols = Object.keys(sheet.data[0]).map((key) => ({
        wch: Math.max(key.length + 2, 15),
      }));
      ws["!cols"] = cols;
      XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31)); // Sheet names max 31 chars
    }
  });

  // Add metadata sheet
  const metaData = Object.entries(metadata).map(([key, value]) => ({
    Field: key,
    Value: value,
  }));
  const metaWs = XLSX.utils.json_to_sheet(metaData);
  metaWs["!cols"] = [{ wch: 20 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, metaWs, "Report Info");

  return wb;
};

const downloadWorkbook = (wb: XLSX.WorkBook, filename: string) => {
  XLSX.writeFile(wb, `${filename}_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`);
};

// Public API
export const generateFormMReport = (options: { period: string; generatedBy: string }) => {
  const data = generateFormMData(50);
  const wb = createWorkbook(
    [{ name: "Form M Applications", data }],
    {
      "Report Title": "Form M Applications Report",
      "Report Type": "Trade Finance - Imports",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Records": String(data.length),
      "Total Value (NGN)": `₦${(data.reduce((sum, d) => sum + (d["NGN Equivalent"] as number), 0) / 1000000000).toFixed(2)}B`,
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "Form_M_Report");
};

export const generateFormAReport = (options: { period: string; generatedBy: string }) => {
  const data = generateFormAData(50);
  const wb = createWorkbook(
    [{ name: "Form A Transactions", data }],
    {
      "Report Title": "Form A Invisibles Report",
      "Report Type": "Trade Finance - Invisibles",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Records": String(data.length),
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "Form_A_Report");
};

export const generateLCReport = (options: { period: string; generatedBy: string }) => {
  const data = generateLCData(50);
  const wb = createWorkbook(
    [{ name: "Letters of Credit", data }],
    {
      "Report Title": "Letters of Credit Report",
      "Report Type": "Trade Finance - Documentary Credits",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Records": String(data.length),
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "LC_Report");
};

export const generateFXReport = (options: { period: string; generatedBy: string }) => {
  const data = generateFXData(50);
  const wb = createWorkbook(
    [{ name: "FX Transactions", data }],
    {
      "Report Title": "Foreign Exchange Transactions Report",
      "Report Type": "Treasury - FX Deals",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Records": String(data.length),
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "FX_Report");
};

export const generateRegulatoryReport = (options: { period: string; generatedBy: string }) => {
  const data = generateComplianceData(50);
  const wb = createWorkbook(
    [{ name: "Compliance Screening", data }],
    {
      "Report Title": "Regulatory Compliance Report",
      "Report Type": "Compliance - Sanctions & AML",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Screenings": String(data.length),
      "High Risk Cases": String(data.filter((d) => d["Risk Level"] === "High" || d["Risk Level"] === "Critical").length),
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "Regulatory_Report");
};

export const generateCBNMonthlyReport = (options: { period: string; generatedBy: string }) => {
  const { formMSummary, fxUtilization, outstandingLCs } = generateCBNData();
  const wb = createWorkbook(
    [
      { name: "Form M Summary", data: formMSummary },
      { name: "FX Utilization", data: fxUtilization },
      { name: "Outstanding LCs", data: outstandingLCs },
    ],
    {
      "Report Title": "CBN Monthly Returns",
      "Report Type": "Regulatory - Central Bank Returns",
      "Reporting Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Form M Count": String(formMSummary.length),
      "Outstanding LC Count": String(outstandingLCs.length),
      "Bank": "Union Bank of Nigeria Plc",
      "CBN Code": "044",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "CBN_Monthly_Report");
};

export const generateMISReport = (options: { period: string; generatedBy: string }) => {
  const { volumeByProduct, branchPerformance, customerAnalysis } = generateMISData();
  const wb = createWorkbook(
    [
      { name: "Volume by Product", data: volumeByProduct },
      { name: "Branch Performance", data: branchPerformance },
      { name: "Top Customers", data: customerAnalysis },
    ],
    {
      "Report Title": "Management Information System Report",
      "Report Type": "MIS - Performance Analytics",
      "Period": options.period,
      "Generated By": options.generatedBy,
      "Generated At": format(new Date(), "PPPPpppp"),
      "Total Products Analyzed": String(volumeByProduct.length),
      "Branches Covered": String(branchPerformance.length),
      "Top Customers": String(customerAnalysis.length),
      "Bank": "Union Bank of Nigeria Plc",
      "Platform": "Ascent Trade Finance",
    }
  );
  downloadWorkbook(wb, "MIS_Report");
};

export const generateCustomReport = (options: {
  title: string;
  subtitle?: string;
  period: string;
  generatedBy: string;
  summary?: { label: string; value: string | number }[];
  tables?: {
    title: string;
    columns: { header: string; dataKey: string }[];
    rows: Record<string, string | number>[];
  }[];
}) => {
  const sheets = options.tables?.map((table) => ({
    name: table.title,
    data: table.rows,
  })) || [];

  const metadata: Record<string, string> = {
    "Report Title": options.title,
    "Subtitle": options.subtitle || "N/A",
    "Period": options.period,
    "Generated By": options.generatedBy,
    "Generated At": format(new Date(), "PPPPpppp"),
    "Bank": "Union Bank of Nigeria Plc",
    "Platform": "Ascent Trade Finance",
  };

  if (options.summary) {
    options.summary.forEach((item) => {
      metadata[item.label] = String(item.value);
    });
  }

  const wb = createWorkbook(sheets, metadata);
  downloadWorkbook(wb, options.title.replace(/\s+/g, "_"));
};
