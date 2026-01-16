import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Download,
  Database,
  Columns3,
  Settings2,
  ChevronRight,
  Check,
  X,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";

interface ReportBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: "custom" | "mis" | "regulatory" | "cbn";
}

const dataSources = {
  custom: [
    { id: "transactions", label: "Transactions", description: "All trade finance transactions", icon: "💳" },
    { id: "customers", label: "Customers", description: "Customer account data", icon: "👥" },
    { id: "formM", label: "Form M", description: "Import applications", icon: "📋" },
    { id: "formA", label: "Form A", description: "Invisible payments", icon: "📄" },
    { id: "lc", label: "Letters of Credit", description: "LC transactions", icon: "📜" },
    { id: "fx", label: "FX Trades", description: "Foreign exchange", icon: "💱" },
  ],
  mis: [
    { id: "volume", label: "Transaction Volume", description: "Volume analysis", icon: "📊" },
    { id: "performance", label: "Product Performance", description: "Success rates", icon: "📈" },
    { id: "branch", label: "Branch Performance", description: "Branch analytics", icon: "🏢" },
    { id: "customer", label: "Customer Analysis", description: "Top customers", icon: "👤" },
    { id: "fee", label: "Fee Income", description: "Fee collection", icon: "💰" },
  ],
  regulatory: [
    { id: "compliance", label: "Compliance Status", description: "Compliance metrics", icon: "✅" },
    { id: "sanctions", label: "Sanctions Screening", description: "Screening results", icon: "🔍" },
    { id: "aml", label: "AML Activity", description: "AML alerts", icon: "🚨" },
    { id: "kyc", label: "KYC Status", description: "KYC compliance", icon: "🪪" },
    { id: "sar", label: "SAR Filed", description: "Suspicious Activity Reports", icon: "📝" },
  ],
  cbn: [
    { id: "formMSummary", label: "Form M Summary", description: "Import summary", icon: "📦" },
    { id: "formASummary", label: "Form A Summary", description: "Invisibles summary", icon: "💸" },
    { id: "nxpSummary", label: "Form NXP Summary", description: "Export summary", icon: "🚢" },
    { id: "fxUtilization", label: "FX Utilization", description: "FX usage report", icon: "💹" },
    { id: "outstandingLC", label: "Outstanding LCs", description: "Outstanding LCs", icon: "📑" },
    { id: "portfolio", label: "Trade Portfolio", description: "Portfolio summary", icon: "📁" },
  ],
};

const columns: Record<string, string[]> = {
  transactions: ["Reference", "Date", "Customer", "Product", "Amount", "Currency", "Status"],
  customers: ["Account Number", "Customer Name", "Segment", "Risk Rating", "Total Volume", "Active Since"],
  formM: ["Form M Number", "Applicant", "Amount", "Currency", "Purpose", "Status", "Expiry Date"],
  formA: ["Form A Number", "Applicant", "Amount", "Currency", "Purpose", "Status"],
  lc: ["LC Reference", "Applicant", "Beneficiary", "Amount", "Currency", "Expiry Date", "Status"],
  fx: ["Deal Reference", "Customer", "Buy Currency", "Sell Currency", "Rate", "Amount", "Status"],
  volume: ["Product", "Count", "Volume", "% of Total", "Growth"],
  performance: ["Product", "Avg Processing Time", "Success Rate", "Fee Income", "SLA Compliance"],
  branch: ["Branch", "Transactions", "Volume", "Fee Income", "Staff Count"],
  customer: ["Customer", "Segment", "Transactions", "Volume", "Revenue"],
  fee: ["Product", "Fee Type", "Count", "Total Fees", "Avg Fee"],
  compliance: ["Category", "Total Items", "Compliant", "Non-Compliant", "Rate"],
  sanctions: ["Date", "Reference", "Customer", "List", "Result", "Action"],
  aml: ["Alert Type", "Count", "Investigated", "Escalated", "Cleared"],
  kyc: ["Customer", "KYC Status", "Last Review", "Next Review", "Risk Rating"],
  sar: ["SAR Reference", "Date Filed", "Category", "Amount", "Status"],
  formMSummary: ["Form M Number", "Applicant", "Currency", "Amount", "Status"],
  formASummary: ["Form A Number", "Applicant", "Purpose", "Currency", "Amount"],
  nxpSummary: ["NXP Number", "Exporter", "Product", "Destination", "Value"],
  fxUtilization: ["Currency", "Allocated", "Utilized", "Balance", "Utilization %"],
  outstandingLC: ["LC Reference", "Applicant", "Amount", "Expiry Date", "Days to Expiry"],
  portfolio: ["Product Type", "Count", "Value", "% of Portfolio"],
};

type Step = "source" | "columns" | "options";

export function ReportBuilderModal({ open, onOpenChange, reportType }: ReportBuilderModalProps) {
  const [step, setStep] = useState<Step>("source");
  const [reportName, setReportName] = useState("");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [outputFormat, setOutputFormat] = useState<"xlsx" | "csv">("xlsx");
  const [isGenerating, setIsGenerating] = useState(false);

  const sources = dataSources[reportType];
  const availableColumns = selectedDataSource ? columns[selectedDataSource] || [] : [];

  const handleDataSourceSelect = (sourceId: string) => {
    setSelectedDataSource(sourceId);
    setSelectedColumns(columns[sourceId] || []);
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const generateSampleData = () => {
    const rows: Record<string, string | number>[] = [];
    const customers = ["Dangote Industries", "Nigerian Breweries", "Flour Mills", "PZ Cussons", "Nestle Nigeria", "Unilever", "Lafarge Africa", "BUA Group", "Honeywell", "Cadbury", "MTN Nigeria", "Access Bank", "GT Bank", "Zenith Bank", "First Bank"];
    const products = ["Form M", "Form A", "Import LC", "Form NXP", "BFC", "Trade Loan"];
    const currencies = ["USD", "EUR", "GBP", "NGN", "CNY"];
    const statuses = ["Approved", "Pending", "Validated", "Completed", "Processing"];
    const branches = ["Victoria Island", "Marina", "Ikeja", "Abuja", "Port Harcourt", "Kano", "Ibadan"];
    const segments = ["Corporate", "Commercial", "SME", "Retail"];
    const ratings = ["Low", "Medium", "High"];

    for (let i = 0; i < 25; i++) {
      const row: Record<string, string | number> = {};
      selectedColumns.forEach((col) => {
        switch (col) {
          case "Reference":
          case "Form M Number":
          case "Form A Number":
          case "LC Reference":
          case "Deal Reference":
          case "NXP Number":
          case "SAR Reference":
            row[col] = `REF${2025}${String(1000 + i).padStart(4, "0")}`;
            break;
          case "Date":
          case "Date Filed":
          case "Expiry Date":
          case "Last Review":
          case "Next Review":
            row[col] = format(new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), "yyyy-MM-dd");
            break;
          case "Customer":
          case "Applicant":
          case "Exporter":
          case "Beneficiary":
          case "Customer Name":
            row[col] = customers[i % customers.length];
            break;
          case "Product":
          case "Product Type":
            row[col] = products[i % products.length];
            break;
          case "Amount":
          case "Volume":
          case "Value":
          case "Total Fees":
          case "Fee Income":
          case "Total Volume":
          case "Revenue":
            row[col] = Math.floor(Math.random() * 500000000 + 10000000);
            break;
          case "Currency":
          case "Buy Currency":
          case "Sell Currency":
            row[col] = currencies[i % currencies.length];
            break;
          case "Status":
          case "Result":
          case "KYC Status":
            row[col] = statuses[i % statuses.length];
            break;
          case "Count":
          case "Transactions":
          case "Staff Count":
            row[col] = Math.floor(Math.random() * 200 + 50);
            break;
          case "% of Total":
          case "Utilization %":
          case "% of Portfolio":
          case "Rate":
          case "Success Rate":
          case "SLA Compliance":
            row[col] = `${(Math.random() * 30 + 70).toFixed(1)}%`;
            break;
          case "Risk Rating":
            row[col] = ratings[i % ratings.length];
            break;
          case "Segment":
            row[col] = segments[i % segments.length];
            break;
          case "Branch":
            row[col] = branches[i % branches.length];
            break;
          case "Category":
          case "Alert Type":
          case "Purpose":
          case "Fee Type":
            row[col] = ["Trade Finance", "FX", "Compliance", "Documentation"][i % 4];
            break;
          case "Days to Expiry":
            row[col] = Math.floor(Math.random() * 90 + 10);
            break;
          case "Avg Processing Time":
            row[col] = `${(Math.random() * 3 + 1).toFixed(1)} days`;
            break;
          case "Allocated":
          case "Utilized":
          case "Balance":
            row[col] = Math.floor(Math.random() * 10000000 + 1000000);
            break;
          case "Destination":
            row[col] = ["Netherlands", "UK", "Germany", "USA", "China", "India"][i % 6];
            break;
          case "List":
            row[col] = ["OFAC", "UN", "EU", "Local"][i % 4];
            break;
          case "Action":
            row[col] = ["Cleared", "Enhanced DD", "Blocked", "Monitoring"][i % 4];
            break;
          case "Investigated":
          case "Escalated":
          case "Cleared":
          case "Compliant":
          case "Non-Compliant":
          case "Total Items":
            row[col] = Math.floor(Math.random() * 100 + 10);
            break;
          case "Growth":
            row[col] = `${(Math.random() * 20 - 5).toFixed(1)}%`;
            break;
          case "Avg Fee":
            row[col] = Math.floor(Math.random() * 500000 + 50000);
            break;
          case "Account Number":
            row[col] = `001${String(Math.floor(Math.random() * 9000000 + 1000000))}`;
            break;
          case "Active Since":
            row[col] = format(new Date(2020 + (i % 5), i % 12, 1), "yyyy-MM");
            break;
          default:
            row[col] = "-";
        }
      });
      rows.push(row);
    }
    return rows;
  };

  const generateReport = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data = generateSampleData();
    const sourceName = sources.find(s => s.id === selectedDataSource)?.label || "Report";
    const fileName = reportName || `${sourceName}_${format(new Date(), "yyyy-MM-dd")}`;

    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = selectedColumns.map(col => ({ wch: Math.max(col.length + 2, 15) }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report Data");

    // Add metadata sheet
    const metadata = [
      { Field: "Report Name", Value: fileName },
      { Field: "Data Source", Value: sourceName },
      { Field: "Report Type", Value: reportType.toUpperCase() },
      { Field: "Columns", Value: selectedColumns.length },
      { Field: "Records", Value: data.length },
      { Field: "Generated By", Value: "Ascent Trade System" },
      { Field: "Generated At", Value: format(new Date(), "PPpp") },
      { Field: "Period From", Value: dateFrom ? format(dateFrom, "yyyy-MM-dd") : "All Time" },
      { Field: "Period To", Value: dateTo ? format(dateTo, "yyyy-MM-dd") : "All Time" },
    ];
    const metaWs = XLSX.utils.json_to_sheet(metadata);
    metaWs['!cols'] = [{ wch: 15 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, metaWs, "Report Info");

    if (outputFormat === "xlsx") {
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      XLSX.writeFile(wb, `${fileName}.csv`, { bookType: "csv" });
    }

    setIsGenerating(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep("source");
    setReportName("");
    setSelectedDataSource("");
    setSelectedColumns([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setOutputFormat("xlsx");
  };

  const getTitle = () => {
    const titles = {
      custom: "Custom Report",
      mis: "MIS Report",
      regulatory: "Regulatory Report",
      cbn: "CBN Monthly Report",
    };
    return titles[reportType];
  };

  const canProceed = () => {
    if (step === "source") return !!selectedDataSource;
    if (step === "columns") return selectedColumns.length > 0;
    return true;
  };

  const nextStep = () => {
    if (step === "source") setStep("columns");
    else if (step === "columns") setStep("options");
  };

  const prevStep = () => {
    if (step === "columns") setStep("source");
    else if (step === "options") setStep("columns");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) resetForm(); onOpenChange(open); }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            Generate {getTitle()}
          </DialogTitle>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { key: "source", label: "Data Source", icon: Database },
              { key: "columns", label: "Columns", icon: Columns3 },
              { key: "options", label: "Export", icon: Settings2 },
            ].map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    step === s.key
                      ? "bg-primary text-primary-foreground"
                      : s.key === "source" || (s.key === "columns" && (step === "columns" || step === "options")) || (s.key === "options" && step === "options")
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {(s.key === "source" && (step === "columns" || step === "options")) ||
                   (s.key === "columns" && step === "options") ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                  {s.label}
                </div>
                {index < 2 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Data Source */}
          {step === "source" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Report Name (Optional)</Label>
                <Input
                  placeholder="Enter a custom name for this report..."
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Data Source</Label>
                <div className="grid grid-cols-2 gap-3">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => handleDataSourceSelect(source.id)}
                      className={cn(
                        "p-4 rounded-xl cursor-pointer transition-all border-2",
                        selectedDataSource === source.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{source.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{source.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{source.description}</div>
                        </div>
                        {selectedDataSource === source.id && (
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start h-11 font-normal">
                        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {dateFrom ? format(dateFrom, "PPP") : <span className="text-muted-foreground">Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start h-11 font-normal">
                        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {dateTo ? format(dateTo, "PPP") : <span className="text-muted-foreground">Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Columns */}
          {step === "columns" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">Select Columns</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose which columns to include in your report
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedColumns(availableColumns)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedColumns([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Selected columns preview */}
              {selectedColumns.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  {selectedColumns.map((col) => (
                    <Badge
                      key={col}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 cursor-pointer"
                      onClick={() => toggleColumn(col)}
                    >
                      {col}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}

              <ScrollArea className="h-[280px] rounded-lg border">
                <div className="p-3 grid grid-cols-2 gap-2">
                  {availableColumns.map((col) => (
                    <div
                      key={col}
                      onClick={() => toggleColumn(col)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        selectedColumns.includes(col)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted border border-transparent"
                      )}
                    >
                      <Checkbox checked={selectedColumns.includes(col)} />
                      <span className="text-sm font-medium">{col}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Step 3: Options & Export */}
          {step === "options" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Export Format</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setOutputFormat("xlsx")}
                    className={cn(
                      "p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-4",
                      outputFormat === "xlsx"
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Excel (.xlsx)</div>
                      <div className="text-xs text-muted-foreground">Best for data analysis</div>
                    </div>
                    {outputFormat === "xlsx" && <Check className="w-5 h-5 text-primary ml-auto" />}
                  </div>
                  <div
                    onClick={() => setOutputFormat("csv")}
                    className={cn(
                      "p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-4",
                      outputFormat === "csv"
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">CSV (.csv)</div>
                      <div className="text-xs text-muted-foreground">Universal format</div>
                    </div>
                    {outputFormat === "csv" && <Check className="w-5 h-5 text-primary ml-auto" />}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <div className="text-sm font-semibold">Report Summary</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Source:</span>
                    <span className="font-medium">{sources.find(s => s.id === selectedDataSource)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="font-medium">{selectedColumns.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">{outputFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span className="font-medium">
                      {dateFrom && dateTo
                        ? `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d")}`
                        : "All Time"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <Button
            variant="ghost"
            onClick={step === "source" ? () => onOpenChange(false) : prevStep}
          >
            {step === "source" ? "Cancel" : "Back"}
          </Button>
          <div className="flex gap-2">
            {step !== "options" ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
