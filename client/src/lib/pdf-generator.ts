import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Union Bank brand colors (RGB values for jsPDF)
const COLORS = {
  primary: { r: 0, g: 51, b: 102 },        // #003366 - Union Bank Blue
  secondary: { r: 0, g: 102, b: 179 },      // #0066B3 - Light Blue
  accent: { r: 218, g: 165, b: 32 },        // #DAA520 - Gold
  success: { r: 34, g: 139, b: 34 },        // #228B22 - Green
  warning: { r: 255, g: 140, b: 0 },        // #FF8C00 - Orange
  danger: { r: 220, g: 20, b: 60 },         // #DC143C - Red
  dark: { r: 31, g: 41, b: 55 },            // #1F2937
  muted: { r: 107, g: 114, b: 128 },        // #6B7280
  light: { r: 248, g: 250, b: 252 },        // #F8FAFC
  border: { r: 226, g: 232, b: 240 },       // #E2E8F0
  white: { r: 255, g: 255, b: 255 },
};

// Union Bank Logo - High quality base64 encoded PNG
const UNION_BANK_LOGO = "data:image/png;base64,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";

interface ReportConfig {
  title: string;
  subtitle?: string;
  period?: string;
  department?: string;
  generatedBy?: string;
}

interface TableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

interface TableData {
  columns: TableColumn[];
  rows: Record<string, string | number>[];
}

interface SummaryItem {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private pageNumber: number;
  private contentWidth: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.contentWidth = this.pageWidth - 2 * this.margin;
    this.currentY = this.margin;
    this.pageNumber = 1;
  }

  private setColor(color: { r: number; g: number; b: number }, type: "fill" | "draw" | "text"): void {
    if (type === "fill") {
      this.doc.setFillColor(color.r, color.g, color.b);
    } else if (type === "draw") {
      this.doc.setDrawColor(color.r, color.g, color.b);
    } else {
      this.doc.setTextColor(color.r, color.g, color.b);
    }
  }

  private addHeader(config: ReportConfig): void {
    // Modern gradient-style header (solid color since jsPDF doesn't support gradients)
    this.setColor(COLORS.primary, "fill");
    this.doc.rect(0, 0, this.pageWidth, 40, "F");

    // Add subtle accent stripe
    this.setColor(COLORS.secondary, "fill");
    this.doc.rect(0, 38, this.pageWidth, 2, "F");

    // Union Bank Logo
    try {
      this.doc.addImage(UNION_BANK_LOGO, "PNG", this.margin, 10, 50, 19);
    } catch {
      // Fallback text logo with better styling
      this.setColor(COLORS.white, "text");
      this.doc.setFontSize(22);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("UNION BANK", this.margin, 20);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.text("of Nigeria Plc", this.margin, 27);
    }

    // Ascent Trade branding (right side)
    this.setColor(COLORS.white, "text");
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    const rightX = this.pageWidth - this.margin;
    this.doc.text("ASCENT TRADE", rightX, 17, { align: "right" });
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.setColor({ r: 200, g: 220, b: 255 }, "text");
    this.doc.text("Trade Finance Platform", rightX, 24, { align: "right" });

    // Report title section with clean background
    this.setColor(COLORS.light, "fill");
    this.doc.rect(0, 40, this.pageWidth, 28, "F");

    // Left border accent
    this.setColor(COLORS.accent, "fill");
    this.doc.rect(0, 40, 4, 28, "F");

    // Report title
    this.setColor(COLORS.primary, "text");
    this.doc.setFontSize(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(config.title, this.margin + 2, 52);

    if (config.subtitle) {
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.setColor(COLORS.muted, "text");
      this.doc.text(config.subtitle, this.margin + 2, 60);
    }

    // Metadata section (right aligned)
    this.doc.setFontSize(8);
    this.setColor(COLORS.muted, "text");
    let metaY = 48;

    if (config.period) {
      this.doc.setFont("helvetica", "bold");
      this.setColor(COLORS.dark, "text");
      this.doc.text("Period:", rightX - 45, metaY);
      this.doc.setFont("helvetica", "normal");
      this.setColor(COLORS.muted, "text");
      this.doc.text(config.period, rightX, metaY, { align: "right" });
      metaY += 6;
    }

    const generatedDate = new Date().toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    this.doc.setFont("helvetica", "bold");
    this.setColor(COLORS.dark, "text");
    this.doc.text("Generated:", rightX - 45, metaY);
    this.doc.setFont("helvetica", "normal");
    this.setColor(COLORS.muted, "text");
    this.doc.text(generatedDate, rightX, metaY, { align: "right" });
    metaY += 6;

    if (config.generatedBy) {
      this.doc.setFont("helvetica", "bold");
      this.setColor(COLORS.dark, "text");
      this.doc.text("By:", rightX - 45, metaY);
      this.doc.setFont("helvetica", "normal");
      this.setColor(COLORS.muted, "text");
      this.doc.text(config.generatedBy, rightX, metaY, { align: "right" });
    }

    this.currentY = 76;
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 12;

    // Footer line
    this.setColor(COLORS.border, "draw");
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, footerY - 6, this.pageWidth - this.margin, footerY - 6);

    // Footer content
    this.doc.setFontSize(7);
    this.setColor(COLORS.muted, "text");
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "Union Bank of Nigeria Plc | Stallion Plaza, 36 Marina, Lagos | RC 2247",
      this.margin,
      footerY - 1
    );

    // Page number with styling
    this.doc.setFont("helvetica", "bold");
    this.setColor(COLORS.primary, "text");
    this.doc.text(`Page ${this.pageNumber}`, this.pageWidth - this.margin, footerY - 1, { align: "right" });

    // Confidentiality notice
    this.doc.setFontSize(6);
    this.setColor(COLORS.muted, "text");
    this.doc.setFont("helvetica", "italic");
    this.doc.text(
      "CONFIDENTIAL - This document contains proprietary information. Unauthorized distribution is prohibited.",
      this.pageWidth / 2,
      footerY + 4,
      { align: "center" }
    );
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 25) {
      this.addFooter();
      this.doc.addPage();
      this.pageNumber++;
      this.currentY = this.margin + 10;
    }
  }

  addSectionTitle(title: string): void {
    this.checkPageBreak(18);

    // Section background stripe
    this.setColor(COLORS.primary, "fill");
    this.doc.rect(this.margin, this.currentY, 4, 10, "F");

    // Light background for title area
    this.setColor({ r: 240, g: 245, b: 250 }, "fill");
    this.doc.rect(this.margin + 4, this.currentY, this.contentWidth - 4, 10, "F");

    // Section title text
    this.setColor(COLORS.primary, "text");
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + 8, this.currentY + 7);

    this.currentY += 16;
  }

  addSummaryCards(items: SummaryItem[]): void {
    this.checkPageBreak(35);

    const cardCount = Math.min(items.length, 4);
    const gap = 4;
    const cardWidth = (this.contentWidth - (cardCount - 1) * gap) / cardCount;
    let cardX = this.margin;

    items.slice(0, 4).forEach((item, index) => {
      // Card shadow effect (lighter rectangle behind)
      this.setColor({ r: 230, g: 235, b: 240 }, "fill");
      this.doc.roundedRect(cardX + 1, this.currentY + 1, cardWidth, 28, 3, 3, "F");

      // Main card background
      this.setColor(COLORS.white, "fill");
      this.doc.roundedRect(cardX, this.currentY, cardWidth, 28, 3, 3, "F");

      // Card border
      this.setColor(COLORS.border, "draw");
      this.doc.setLineWidth(0.3);
      this.doc.roundedRect(cardX, this.currentY, cardWidth, 28, 3, 3, "S");

      // Top accent line (alternating colors for visual interest)
      const accentColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success];
      this.setColor(accentColors[index % accentColors.length], "fill");
      this.doc.rect(cardX, this.currentY, cardWidth, 2, "F");

      // Label
      this.doc.setFontSize(8);
      this.setColor(COLORS.muted, "text");
      this.doc.setFont("helvetica", "normal");
      this.doc.text(item.label, cardX + 5, this.currentY + 10);

      // Value - larger and bold
      this.doc.setFontSize(16);
      this.setColor(COLORS.dark, "text");
      this.doc.setFont("helvetica", "bold");
      this.doc.text(String(item.value), cardX + 5, this.currentY + 22);

      // Trend indicator if provided
      if (item.trend && item.trendValue) {
        const trendColor = item.trend === "up" ? COLORS.success : item.trend === "down" ? COLORS.danger : COLORS.muted;
        this.setColor(trendColor, "text");
        this.doc.setFontSize(7);
        this.doc.setFont("helvetica", "normal");
        const trendSymbol = item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "●";
        this.doc.text(`${trendSymbol} ${item.trendValue}`, cardX + cardWidth - 5, this.currentY + 22, { align: "right" });
      }

      cardX += cardWidth + gap;
    });

    this.currentY += 36;
  }

  addTable(tableData: TableData, options?: { title?: string; striped?: boolean }): void {
    if (options?.title) {
      this.checkPageBreak(12);
      this.doc.setFontSize(10);
      this.setColor(COLORS.dark, "text");
      this.doc.setFont("helvetica", "bold");
      this.doc.text(options.title, this.margin, this.currentY);
      this.currentY += 8;
    }

    this.checkPageBreak(45);

    const columns = tableData.columns.map((col) => ({
      header: col.header,
      dataKey: col.dataKey,
    }));

    const body = tableData.rows.map((row) =>
      tableData.columns.map((col) => String(row[col.dataKey] ?? ""))
    );

    autoTable(this.doc, {
      startY: this.currentY,
      head: [columns.map((c) => c.header)],
      body: body,
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        textColor: [COLORS.dark.r, COLORS.dark.g, COLORS.dark.b],
        lineColor: [COLORS.border.r, COLORS.border.g, COLORS.border.b],
        lineWidth: 0.2,
        font: "helvetica",
      },
      headStyles: {
        fillColor: [COLORS.primary.r, COLORS.primary.g, COLORS.primary.b],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 5,
      },
      alternateRowStyles: options?.striped
        ? {
            fillColor: [COLORS.light.r, COLORS.light.g, COLORS.light.b],
          }
        : undefined,
      columnStyles: tableData.columns.reduce(
        (acc, col, idx) => {
          if (col.width) {
            acc[idx] = { cellWidth: col.width };
          }
          return acc;
        },
        {} as Record<number, { cellWidth: number }>
      ),
      didDrawPage: () => {
        // This helps with multi-page tables
      },
    });

    this.currentY = (this.doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  addParagraph(text: string): void {
    this.checkPageBreak(20);

    this.doc.setFontSize(9);
    this.setColor(COLORS.dark, "text");
    this.doc.setFont("helvetica", "normal");

    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    this.doc.text(lines, this.margin, this.currentY);

    this.currentY += lines.length * 5 + 8;
  }

  addKeyValue(items: Array<{ key: string; value: string }>): void {
    this.checkPageBreak(items.length * 8 + 10);

    const keyWidth = 50;

    items.forEach((item) => {
      // Key
      this.doc.setFontSize(9);
      this.setColor(COLORS.muted, "text");
      this.doc.setFont("helvetica", "normal");
      this.doc.text(`${item.key}:`, this.margin, this.currentY);

      // Value
      this.setColor(COLORS.dark, "text");
      this.doc.setFont("helvetica", "bold");
      this.doc.text(item.value, this.margin + keyWidth, this.currentY);

      this.currentY += 7;
    });

    this.currentY += 5;
  }

  addDivider(): void {
    this.checkPageBreak(10);
    this.setColor(COLORS.border, "draw");
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 8;
  }

  addSignatureBlock(): void {
    this.checkPageBreak(55);

    this.currentY += 10;

    // Divider with text
    this.setColor(COLORS.border, "draw");
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);

    this.currentY += 5;
    this.doc.setFontSize(8);
    this.setColor(COLORS.muted, "text");
    this.doc.setFont("helvetica", "italic");
    this.doc.text("Authorization", this.pageWidth / 2, this.currentY, { align: "center" });

    this.currentY += 12;

    const sigWidth = (this.contentWidth - 30) / 2;

    // Prepared By box
    this.setColor(COLORS.light, "fill");
    this.doc.roundedRect(this.margin, this.currentY, sigWidth, 32, 2, 2, "F");
    this.setColor(COLORS.border, "draw");
    this.doc.roundedRect(this.margin, this.currentY, sigWidth, 32, 2, 2, "S");

    this.doc.setFontSize(9);
    this.setColor(COLORS.primary, "text");
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Prepared By", this.margin + 5, this.currentY + 8);

    this.setColor(COLORS.border, "draw");
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin + 5, this.currentY + 22, this.margin + sigWidth - 5, this.currentY + 22);

    this.doc.setFontSize(7);
    this.setColor(COLORS.muted, "text");
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Signature / Name / Date", this.margin + 5, this.currentY + 28);

    // Approved By box
    const approvedX = this.margin + sigWidth + 30;
    this.setColor(COLORS.light, "fill");
    this.doc.roundedRect(approvedX, this.currentY, sigWidth, 32, 2, 2, "F");
    this.setColor(COLORS.border, "draw");
    this.doc.roundedRect(approvedX, this.currentY, sigWidth, 32, 2, 2, "S");

    this.doc.setFontSize(9);
    this.setColor(COLORS.primary, "text");
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Approved By", approvedX + 5, this.currentY + 8);

    this.doc.line(approvedX + 5, this.currentY + 22, approvedX + sigWidth - 5, this.currentY + 22);

    this.doc.setFontSize(7);
    this.setColor(COLORS.muted, "text");
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Signature / Name / Date", approvedX + 5, this.currentY + 28);

    this.currentY += 40;
  }

  addSpacing(height: number): void {
    this.currentY += height;
  }

  generate(config: ReportConfig): jsPDF {
    this.addHeader(config);
    return this.doc;
  }

  finalize(): void {
    this.addFooter();
  }

  save(filename: string): void {
    this.finalize();
    this.doc.save(filename);
  }

  getBlob(): Blob {
    this.finalize();
    return this.doc.output("blob");
  }

  getDataUrl(): string {
    this.finalize();
    return this.doc.output("dataurlstring");
  }
}

// Pre-built report generators with improved styling
export function generateMISReport(data: {
  period: string;
  generatedBy: string;
}): void {
  const pdf = new PDFGenerator();
  pdf.generate({
    title: "MIS Report",
    subtitle: "Management Information System - Trade Finance Operations",
    period: data.period,
    generatedBy: data.generatedBy,
  });

  // Executive Summary with trends
  pdf.addSectionTitle("Executive Summary");
  pdf.addSummaryCards([
    { label: "Total Transactions", value: "1,247", trend: "up", trendValue: "+12.3%" },
    { label: "Total Volume", value: "₦45.8B", trend: "up", trendValue: "+8.7%" },
    { label: "Avg Processing Time", value: "2.4 days", trend: "down", trendValue: "-0.3 days" },
    { label: "Success Rate", value: "98.5%", trend: "up", trendValue: "+1.2%" },
  ]);

  pdf.addParagraph(
    "This MIS report provides a comprehensive analysis of Union Bank's trade finance operations for the reporting period. " +
    "The bank processed a total of 1,247 trade transactions valued at ₦45.8 billion, representing a 12% increase from the previous period. " +
    "Key performance indicators show strong operational efficiency with a 98.5% success rate and average processing time of 2.4 days."
  );

  // Transaction Volume Analysis
  pdf.addSectionTitle("Transaction Volume Analysis");
  pdf.addTable(
    {
      columns: [
        { header: "Product", dataKey: "product" },
        { header: "Count", dataKey: "count" },
        { header: "Volume (NGN)", dataKey: "volume" },
        { header: "% of Total", dataKey: "percentage" },
        { header: "Growth", dataKey: "growth" },
      ],
      rows: [
        { product: "Form M (Imports)", count: "342", volume: "₦18,450,000,000", percentage: "40.2%", growth: "+15.2%" },
        { product: "Form A (Invisibles)", count: "186", volume: "₦5,230,000,000", percentage: "11.4%", growth: "+8.4%" },
        { product: "Import Letters of Credit", count: "124", volume: "₦12,680,000,000", percentage: "27.7%", growth: "+12.1%" },
        { product: "Form NXP (Exports)", count: "89", volume: "₦4,120,000,000", percentage: "9.0%", growth: "+22.3%" },
        { product: "Bills for Collection", count: "156", volume: "₦2,890,000,000", percentage: "6.3%", growth: "+5.7%" },
        { product: "Trade Loans", count: "78", volume: "₦1,650,000,000", percentage: "3.6%", growth: "-2.1%" },
        { product: "Inward Payments", count: "272", volume: "₦780,000,000", percentage: "1.8%", growth: "+18.9%" },
      ],
    },
    { striped: true }
  );

  // Product Performance
  pdf.addSectionTitle("Product Performance Metrics");
  pdf.addTable(
    {
      columns: [
        { header: "Product", dataKey: "product" },
        { header: "Avg Processing", dataKey: "avgTime" },
        { header: "Success Rate", dataKey: "successRate" },
        { header: "Fee Income", dataKey: "feeIncome" },
        { header: "SLA Compliance", dataKey: "sla" },
      ],
      rows: [
        { product: "Form M (Imports)", avgTime: "1.8 days", successRate: "99.1%", feeIncome: "₦184.5M", sla: "97.8%" },
        { product: "Form A (Invisibles)", avgTime: "1.2 days", successRate: "99.5%", feeIncome: "₦52.3M", sla: "99.2%" },
        { product: "Import Letters of Credit", avgTime: "3.5 days", successRate: "97.6%", feeIncome: "₦253.6M", sla: "94.3%" },
        { product: "Form NXP (Exports)", avgTime: "2.1 days", successRate: "98.9%", feeIncome: "₦41.2M", sla: "96.5%" },
        { product: "Bills for Collection", avgTime: "4.2 days", successRate: "96.8%", feeIncome: "₦43.4M", sla: "91.2%" },
        { product: "Trade Loans", avgTime: "5.8 days", successRate: "94.9%", feeIncome: "₦82.5M", sla: "88.7%" },
      ],
    },
    { striped: true }
  );

  // Branch Performance
  pdf.addSectionTitle("Branch Performance Analysis");
  pdf.addTable(
    {
      columns: [
        { header: "Branch", dataKey: "branch" },
        { header: "Transactions", dataKey: "transactions" },
        { header: "Volume", dataKey: "volume" },
        { header: "Fee Income", dataKey: "feeIncome" },
        { header: "Rank", dataKey: "rank" },
      ],
      rows: [
        { branch: "Victoria Island Branch", transactions: "312", volume: "₦12.45B", feeIncome: "₦186.8M", rank: "1" },
        { branch: "Marina Head Office", transactions: "278", volume: "₦10.89B", feeIncome: "₦163.4M", rank: "2" },
        { branch: "Ikeja Branch", transactions: "189", volume: "₦7.23B", feeIncome: "₦108.5M", rank: "3" },
        { branch: "Port Harcourt Branch", transactions: "156", volume: "₦6.12B", feeIncome: "₦91.8M", rank: "4" },
        { branch: "Abuja Branch", transactions: "142", volume: "₦5.89B", feeIncome: "₦88.4M", rank: "5" },
        { branch: "Kano Branch", transactions: "98", volume: "₦2.12B", feeIncome: "₦31.8M", rank: "6" },
        { branch: "Others", transactions: "72", volume: "₦1.10B", feeIncome: "₦16.5M", rank: "-" },
      ],
    },
    { striped: true }
  );

  // Top Customers
  pdf.addSectionTitle("Top 10 Customers by Volume");
  pdf.addTable(
    {
      columns: [
        { header: "#", dataKey: "rank" },
        { header: "Customer Name", dataKey: "customer" },
        { header: "Segment", dataKey: "segment" },
        { header: "Transactions", dataKey: "transactions" },
        { header: "Volume", dataKey: "volume" },
      ],
      rows: [
        { rank: "1", customer: "Dangote Industries Limited", segment: "Corporate", transactions: "45", volume: "₦4.25B" },
        { rank: "2", customer: "Nigerian Breweries Plc", segment: "Corporate", transactions: "38", volume: "₦3.12B" },
        { rank: "3", customer: "Flour Mills of Nigeria Plc", segment: "Corporate", transactions: "32", volume: "₦2.89B" },
        { rank: "4", customer: "PZ Cussons Nigeria Plc", segment: "Corporate", transactions: "28", volume: "₦2.45B" },
        { rank: "5", customer: "Nestle Nigeria Plc", segment: "Corporate", transactions: "25", volume: "₦2.18B" },
        { rank: "6", customer: "Unilever Nigeria Plc", segment: "Corporate", transactions: "22", volume: "₦1.95B" },
        { rank: "7", customer: "Lafarge Africa Plc", segment: "Corporate", transactions: "20", volume: "₦1.78B" },
        { rank: "8", customer: "Honeywell Flour Mills", segment: "Commercial", transactions: "18", volume: "₦1.52B" },
        { rank: "9", customer: "BUA Group", segment: "Corporate", transactions: "16", volume: "₦1.38B" },
        { rank: "10", customer: "Cadbury Nigeria Plc", segment: "Corporate", transactions: "14", volume: "₦1.12B" },
      ],
    },
    { striped: true }
  );

  pdf.addDivider();

  pdf.addParagraph(
    "The above analysis indicates healthy trade finance activity across all product lines. Import-related transactions continue to dominate " +
    "the portfolio, accounting for over 67% of total volume. Recommendations include focused marketing efforts on export finance products " +
    "and enhanced processing efficiency for Letters of Credit to improve SLA compliance rates."
  );

  pdf.addSignatureBlock();
  pdf.save(`MIS_Report_${data.period.replace(/\s/g, "_")}.pdf`);
}

export function generateRegulatoryReport(data: {
  period: string;
  generatedBy: string;
}): void {
  const pdf = new PDFGenerator();
  pdf.generate({
    title: "Regulatory Compliance Report",
    subtitle: "Trade Finance Compliance Status and Monitoring",
    period: data.period,
    generatedBy: data.generatedBy,
  });

  // Executive Summary
  pdf.addSectionTitle("Executive Summary");
  pdf.addSummaryCards([
    { label: "Overall Compliance", value: "99.2%", trend: "up", trendValue: "+0.4%" },
    { label: "Screenings Done", value: "3,456", trend: "up", trendValue: "+15%" },
    { label: "SAR Filed", value: "12", trend: "neutral", trendValue: "Same" },
    { label: "False Positive Rate", value: "89%", trend: "down", trendValue: "-3%" },
  ]);

  pdf.addParagraph(
    "This regulatory compliance report provides a comprehensive overview of Union Bank's adherence to CBN regulations, " +
    "NFIU guidelines, and international AML/CFT standards for trade finance operations. The bank maintains robust compliance " +
    "controls with an overall compliance rate of 99.2% across all monitored parameters."
  );

  // Compliance Status Overview
  pdf.addSectionTitle("Compliance Status Overview");
  pdf.addTable(
    {
      columns: [
        { header: "Category", dataKey: "category" },
        { header: "Total Items", dataKey: "total" },
        { header: "Compliant", dataKey: "compliant" },
        { header: "Non-Compliant", dataKey: "nonCompliant" },
        { header: "Rate", dataKey: "rate" },
      ],
      rows: [
        { category: "KYC Documentation", total: "1,247", compliant: "1,238", nonCompliant: "9", rate: "99.3%" },
        { category: "Form M Validity", total: "342", compliant: "340", nonCompliant: "2", rate: "99.4%" },
        { category: "Form A Documentation", total: "186", compliant: "184", nonCompliant: "2", rate: "98.9%" },
        { category: "LC Compliance", total: "124", compliant: "122", nonCompliant: "2", rate: "98.4%" },
        { category: "PAAR Reconciliation", total: "89", compliant: "87", nonCompliant: "2", rate: "97.8%" },
        { category: "Export Proceeds Repatriation", total: "156", compliant: "153", nonCompliant: "3", rate: "98.1%" },
        { category: "BDC Transaction Limits", total: "412", compliant: "412", nonCompliant: "0", rate: "100%" },
      ],
    },
    { striped: true }
  );

  // Sanctions Screening Results
  pdf.addSectionTitle("Sanctions Screening Results");
  pdf.addParagraph(
    "All trade finance transactions undergo mandatory sanctions screening against OFAC SDN List, UN Security Council " +
    "Consolidated List, EU Sanctions List, and Nigeria's local watchlist."
  );
  pdf.addTable(
    {
      columns: [
        { header: "Date", dataKey: "date" },
        { header: "Reference", dataKey: "reference" },
        { header: "Customer", dataKey: "customer" },
        { header: "List", dataKey: "list" },
        { header: "Result", dataKey: "result" },
        { header: "Action", dataKey: "action" },
      ],
      rows: [
        { date: "Jan 12, 2025", reference: "FM/2025/0892", customer: "ABC Trading Ltd", list: "OFAC", result: "False Positive", action: "Cleared" },
        { date: "Jan 10, 2025", reference: "FA/2025/0456", customer: "XYZ Imports", list: "UN", result: "False Positive", action: "Cleared" },
        { date: "Jan 08, 2025", reference: "LC/2025/0234", customer: "Global Ventures", list: "EU", result: "False Positive", action: "Cleared" },
        { date: "Jan 05, 2025", reference: "FM/2025/0678", customer: "Prime Merchants", list: "Local", result: "False Positive", action: "Cleared" },
        { date: "Jan 03, 2025", reference: "NXP/2025/0123", customer: "Sunrise Exports", list: "PEP", result: "Match", action: "Enhanced DD" },
        { date: "Dec 28, 2024", reference: "FM/2024/8934", customer: "Silverline Ltd", list: "OFAC", result: "False Positive", action: "Cleared" },
      ],
    },
    { striped: true }
  );

  // AML Activity Summary
  pdf.addSectionTitle("AML Activity Summary");
  pdf.addTable(
    {
      columns: [
        { header: "Alert Type", dataKey: "alertType" },
        { header: "Count", dataKey: "count" },
        { header: "Investigated", dataKey: "investigated" },
        { header: "Escalated", dataKey: "escalated" },
        { header: "Cleared", dataKey: "cleared" },
      ],
      rows: [
        { alertType: "Large Value Transaction", count: "156", investigated: "156", escalated: "8", cleared: "148" },
        { alertType: "Unusual Pattern", count: "89", investigated: "89", escalated: "4", cleared: "85" },
        { alertType: "High Risk Country", count: "67", investigated: "67", escalated: "12", cleared: "55" },
        { alertType: "Sanctions Hit", count: "45", investigated: "45", escalated: "2", cleared: "43" },
        { alertType: "PEP Transaction", count: "34", investigated: "34", escalated: "6", cleared: "28" },
        { alertType: "Rapid Movement", count: "28", investigated: "28", escalated: "3", cleared: "25" },
        { alertType: "Structuring Suspicion", count: "12", investigated: "12", escalated: "5", cleared: "7" },
      ],
    },
    { striped: true }
  );

  // SARs Filed
  pdf.addSectionTitle("Suspicious Activity Reports Filed");
  pdf.addTable(
    {
      columns: [
        { header: "SAR Ref", dataKey: "sarRef" },
        { header: "Date Filed", dataKey: "dateFiled" },
        { header: "Category", dataKey: "category" },
        { header: "Amount", dataKey: "amount" },
        { header: "Status", dataKey: "status" },
      ],
      rows: [
        { sarRef: "SAR/2025/001", dateFiled: "Jan 10, 2025", category: "Unusual Pattern", amount: "₦125M", status: "Filed with NFIU" },
        { sarRef: "SAR/2025/002", dateFiled: "Jan 08, 2025", category: "High Risk Jurisdiction", amount: "₦89M", status: "Filed with NFIU" },
        { sarRef: "SAR/2024/089", dateFiled: "Dec 28, 2024", category: "Structuring", amount: "₦45M", status: "Under Review" },
        { sarRef: "SAR/2024/088", dateFiled: "Dec 15, 2024", category: "PEP Related", amount: "₦234M", status: "Closed" },
      ],
    },
    { striped: true }
  );

  pdf.addDivider();

  pdf.addParagraph(
    "This report has been prepared in accordance with Central Bank of Nigeria regulations, Nigeria Financial Intelligence Unit (NFIU) " +
    "guidelines, and AML/CFT standards. All sanctions screening is conducted against OFAC SDN, UN, EU, and local watchlists. " +
    "Any identified non-compliance items are being actively remediated with target completion within 30 days."
  );

  pdf.addSignatureBlock();
  pdf.save(`Regulatory_Report_${data.period.replace(/\s/g, "_")}.pdf`);
}

export function generateCBNMonthlyReport(data: {
  period: string;
  generatedBy: string;
}): void {
  const pdf = new PDFGenerator();
  pdf.generate({
    title: "CBN Monthly Return",
    subtitle: "Central Bank of Nigeria - Trade Finance Monthly Report",
    period: data.period,
    generatedBy: data.generatedBy,
  });

  // Executive Summary
  pdf.addSectionTitle("Executive Summary");
  pdf.addSummaryCards([
    { label: "Total Form M", value: "₦18.4B", trend: "up", trendValue: "+12%" },
    { label: "Total Form A", value: "₦5.2B", trend: "up", trendValue: "+8%" },
    { label: "Total NXP", value: "₦4.1B", trend: "up", trendValue: "+22%" },
    { label: "Outstanding LCs", value: "₦12.7B", trend: "down", trendValue: "-5%" },
  ]);

  pdf.addParagraph(
    "This CBN Monthly Return covers Union Bank's trade finance activities for the reporting period. " +
    "Total import transactions through Form M amounted to ₦18.4 billion, while invisible payments via Form A totaled ₦5.2 billion. " +
    "Export transactions through Form NXP reached ₦4.1 billion. The bank maintains outstanding Letters of Credit valued at ₦12.7 billion."
  );

  // Form M Summary (Imports)
  pdf.addSectionTitle("Form M Summary (Imports)");
  pdf.addTable(
    {
      columns: [
        { header: "Form M Number", dataKey: "formMNumber" },
        { header: "Applicant", dataKey: "applicant" },
        { header: "Currency", dataKey: "currency" },
        { header: "Amount", dataKey: "amount" },
        { header: "Status", dataKey: "status" },
      ],
      rows: [
        { formMNumber: "MF20250000892", applicant: "Dangote Industries Ltd", currency: "USD", amount: "$2,450,000", status: "Validated" },
        { formMNumber: "MF20250000891", applicant: "Nigerian Breweries Plc", currency: "EUR", amount: "€1,890,000", status: "Validated" },
        { formMNumber: "MF20250000890", applicant: "Flour Mills Nigeria", currency: "USD", amount: "$3,120,000", status: "Validated" },
        { formMNumber: "MF20250000889", applicant: "PZ Cussons Nigeria", currency: "GBP", amount: "£980,000", status: "Validated" },
        { formMNumber: "MF20250000888", applicant: "Nestle Nigeria Plc", currency: "USD", amount: "$1,750,000", status: "Pending" },
        { formMNumber: "MF20250000887", applicant: "Unilever Nigeria Plc", currency: "EUR", amount: "€2,340,000", status: "Validated" },
        { formMNumber: "MF20250000886", applicant: "Lafarge Africa Plc", currency: "USD", amount: "$4,560,000", status: "Validated" },
        { formMNumber: "MF20250000885", applicant: "BUA Group", currency: "USD", amount: "$2,890,000", status: "Validated" },
      ],
    },
    { striped: true }
  );

  // Form A Summary (Invisibles)
  pdf.addSectionTitle("Form A Summary (Invisibles)");
  pdf.addTable(
    {
      columns: [
        { header: "Form A Number", dataKey: "formANumber" },
        { header: "Applicant", dataKey: "applicant" },
        { header: "Purpose", dataKey: "purpose" },
        { header: "Currency", dataKey: "currency" },
        { header: "Amount", dataKey: "amount" },
      ],
      rows: [
        { formANumber: "FA20250000456", applicant: "MTN Nigeria Ltd", purpose: "Technical Service Fee", currency: "USD", amount: "$850,000" },
        { formANumber: "FA20250000455", applicant: "Airtel Nigeria", purpose: "Management Fee", currency: "USD", amount: "$620,000" },
        { formANumber: "FA20250000454", applicant: "Shell Nigeria", purpose: "Dividend Repatriation", currency: "USD", amount: "$2,340,000" },
        { formANumber: "FA20250000453", applicant: "TotalEnergies Nigeria", purpose: "Royalty Payment", currency: "EUR", amount: "€1,120,000" },
        { formANumber: "FA20250000452", applicant: "Chevron Nigeria", purpose: "Technical Service Fee", currency: "USD", amount: "$1,890,000" },
        { formANumber: "FA20250000451", applicant: "Microsoft Nigeria", purpose: "License Fee", currency: "USD", amount: "$450,000" },
      ],
    },
    { striped: true }
  );

  // Form NXP Summary (Exports)
  pdf.addSectionTitle("Form NXP Summary (Exports)");
  pdf.addTable(
    {
      columns: [
        { header: "NXP Number", dataKey: "nxpNumber" },
        { header: "Exporter", dataKey: "exporter" },
        { header: "Product", dataKey: "product" },
        { header: "Destination", dataKey: "destination" },
        { header: "Value (USD)", dataKey: "value" },
      ],
      rows: [
        { nxpNumber: "NXP20250000123", exporter: "Olam Nigeria Ltd", product: "Cocoa Beans", destination: "Netherlands", value: "$1,250,000" },
        { nxpNumber: "NXP20250000122", exporter: "Dangote Cement", product: "Cement", destination: "Ghana", value: "$890,000" },
        { nxpNumber: "NXP20250000121", exporter: "Presco Plc", product: "Palm Oil", destination: "United Kingdom", value: "$720,000" },
        { nxpNumber: "NXP20250000120", exporter: "Okomu Oil Palm", product: "Palm Kernel", destination: "Germany", value: "$560,000" },
        { nxpNumber: "NXP20250000119", exporter: "BUA Foods", product: "Sesame Seeds", destination: "Japan", value: "$430,000" },
        { nxpNumber: "NXP20250000118", exporter: "Starlink Exports", product: "Cashew Nuts", destination: "Vietnam", value: "$680,000" },
      ],
    },
    { striped: true }
  );

  // FX Utilization Report
  pdf.addSectionTitle("FX Utilization Report");
  pdf.addTable(
    {
      columns: [
        { header: "Currency", dataKey: "currency" },
        { header: "Allocated", dataKey: "allocated" },
        { header: "Utilized", dataKey: "utilized" },
        { header: "Balance", dataKey: "balance" },
        { header: "Rate", dataKey: "utilizationRate" },
      ],
      rows: [
        { currency: "USD", allocated: "$45,000,000", utilized: "$38,450,000", balance: "$6,550,000", utilizationRate: "85.4%" },
        { currency: "EUR", allocated: "€12,000,000", utilized: "€9,680,000", balance: "€2,320,000", utilizationRate: "80.7%" },
        { currency: "GBP", allocated: "£8,000,000", utilized: "£6,230,000", balance: "£1,770,000", utilizationRate: "77.9%" },
        { currency: "CNY", allocated: "¥25,000,000", utilized: "¥18,500,000", balance: "¥6,500,000", utilizationRate: "74.0%" },
      ],
    },
    { striped: true }
  );

  // Outstanding LCs
  pdf.addSectionTitle("Outstanding Letters of Credit");
  pdf.addTable(
    {
      columns: [
        { header: "LC Reference", dataKey: "lcRef" },
        { header: "Applicant", dataKey: "applicant" },
        { header: "Amount", dataKey: "amount" },
        { header: "Expiry", dataKey: "expiryDate" },
        { header: "Days Left", dataKey: "daysToExpiry" },
      ],
      rows: [
        { lcRef: "LC/2025/0234", applicant: "Dangote Industries", amount: "$3,450,000", expiryDate: "Mar 15, 2025", daysToExpiry: "59" },
        { lcRef: "LC/2025/0233", applicant: "Nigerian Breweries", amount: "€2,120,000", expiryDate: "Feb 28, 2025", daysToExpiry: "44" },
        { lcRef: "LC/2025/0232", applicant: "Flour Mills Nigeria", amount: "$1,890,000", expiryDate: "Apr 10, 2025", daysToExpiry: "85" },
        { lcRef: "LC/2025/0231", applicant: "PZ Cussons", amount: "£1,560,000", expiryDate: "Mar 30, 2025", daysToExpiry: "74" },
        { lcRef: "LC/2025/0230", applicant: "Nestle Nigeria", amount: "$2,340,000", expiryDate: "Feb 20, 2025", daysToExpiry: "36" },
        { lcRef: "LC/2024/0895", applicant: "Unilever Nigeria", amount: "€1,780,000", expiryDate: "Jan 25, 2025", daysToExpiry: "10" },
      ],
    },
    { striped: true }
  );

  // Trade Portfolio Summary
  pdf.addSectionTitle("Trade Portfolio Summary");
  pdf.addTable(
    {
      columns: [
        { header: "Product Type", dataKey: "product" },
        { header: "Count", dataKey: "count" },
        { header: "Value (NGN)", dataKey: "value" },
        { header: "% of Portfolio", dataKey: "percentage" },
      ],
      rows: [
        { product: "Form M (Imports)", count: "342", value: "₦18,450,000,000", percentage: "45.2%" },
        { product: "Import Letters of Credit", count: "124", value: "₦12,680,000,000", percentage: "31.1%" },
        { product: "Form A (Invisibles)", count: "186", value: "₦5,230,000,000", percentage: "12.8%" },
        { product: "Form NXP (Exports)", count: "89", value: "₦4,120,000,000", percentage: "10.1%" },
        { product: "PAAR", count: "45", value: "₦320,000,000", percentage: "0.8%" },
        { product: "Total", count: "786", value: "₦40,800,000,000", percentage: "100%" },
      ],
    },
    { striped: true }
  );

  pdf.addDivider();

  pdf.addParagraph(
    "This report is submitted in compliance with Central Bank of Nigeria Trade Finance reporting requirements as stipulated in the " +
    "CBN Circular TED/FEM/FPC/GEN/01/007. All figures are accurate as of the report generation date and have been validated against " +
    "source systems. The bank confirms adherence to all FX utilization guidelines and Form M/A/NXP processing timelines."
  );

  pdf.addSignatureBlock();
  pdf.save(`CBN_Monthly_Return_${data.period.replace(/\s/g, "_")}.pdf`);
}

export function generateCustomReport(data: {
  title: string;
  subtitle?: string;
  period?: string;
  generatedBy: string;
  summary?: SummaryItem[];
  tables: Array<{
    title: string;
    columns: TableColumn[];
    rows: Record<string, string | number>[];
  }>;
}): void {
  const pdf = new PDFGenerator();
  pdf.generate({
    title: data.title,
    subtitle: data.subtitle,
    period: data.period,
    generatedBy: data.generatedBy,
  });

  if (data.summary && data.summary.length > 0) {
    pdf.addSectionTitle("Summary");
    pdf.addSummaryCards(data.summary);
  }

  data.tables.forEach((table) => {
    pdf.addSectionTitle(table.title);
    pdf.addTable(
      {
        columns: table.columns,
        rows: table.rows,
      },
      { striped: true }
    );
  });

  pdf.addSignatureBlock();
  pdf.save(`${data.title.replace(/\s/g, "_")}_Report.pdf`);
}
