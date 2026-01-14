import * as XLSX from "xlsx";

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const colWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => String(row[key] || "").length)
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  worksheet["!cols"] = colWidths;
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function formatTransactionForExport(transaction: {
  referenceNumber?: string;
  productType?: string;
  customerId?: string;
  amount?: number;
  currency?: string | null;
  status?: string;
  priority?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  description?: string | null;
}) {
  return {
    "Reference Number": transaction.referenceNumber || "",
    "Product Type": transaction.productType || "",
    "Customer ID": transaction.customerId || "",
    "Amount": transaction.amount || 0,
    "Currency": transaction.currency || "",
    "Status": transaction.status || "",
    "Priority": transaction.priority || "",
    "Created Date": transaction.createdAt 
      ? new Date(transaction.createdAt).toLocaleDateString() 
      : "",
    "Updated Date": transaction.updatedAt 
      ? new Date(transaction.updatedAt).toLocaleDateString() 
      : "",
    "Description": transaction.description || "",
  };
}

export function formatCustomerForExport(customer: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  rcNumber?: string;
  address?: string;
}, transactionCount?: number) {
  return {
    "Customer ID": customer.id || "",
    "Name": customer.name || "",
    "Email": customer.email || "",
    "Phone": customer.phone || "",
    "Account Number": customer.accountNumber || "",
    "RC Number": customer.rcNumber || "",
    "Address": customer.address || "",
    "Transaction Count": transactionCount || 0,
  };
}

export function formatFxTradeForExport(trade: {
  id?: string;
  dealNumber?: string;
  tradeType?: string;
  buyCurrency?: string;
  sellCurrency?: string;
  buyAmount?: number;
  sellAmount?: number;
  rate?: number;
  customer?: string;
  status?: string;
  tradeDate?: string;
  valueDate?: string;
  trader?: string;
}) {
  return {
    "Deal Number": trade.dealNumber || "",
    "Trade Type": trade.tradeType || "",
    "Buy Currency": trade.buyCurrency || "",
    "Sell Currency": trade.sellCurrency || "",
    "Buy Amount": trade.buyAmount || 0,
    "Sell Amount": trade.sellAmount || 0,
    "Rate": trade.rate || 0,
    "Customer": trade.customer || "",
    "Status": trade.status || "",
    "Trade Date": trade.tradeDate || "",
    "Value Date": trade.valueDate || "",
    "Trader": trade.trader || "",
  };
}

export function formatComplianceIssueForExport(issue: {
  id?: string;
  referenceNumber?: string;
  issueType?: string;
  severity?: string;
  status?: string;
  description?: string;
  affectedTransaction?: string;
  reportedBy?: string;
  reportedDate?: string;
  resolvedDate?: string;
}) {
  return {
    "Reference": issue.referenceNumber || "",
    "Issue Type": issue.issueType || "",
    "Severity": issue.severity || "",
    "Status": issue.status || "",
    "Description": issue.description || "",
    "Affected Transaction": issue.affectedTransaction || "",
    "Reported By": issue.reportedBy || "",
    "Reported Date": issue.reportedDate || "",
    "Resolved Date": issue.resolvedDate || "",
  };
}
