import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionTable } from "@/components/TransactionTable";
import { mockTransactions } from "@/lib/mockData";
import { productTypes } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FileCheck,
  FileSpreadsheet,
  FileSearch,
  Ship,
  CreditCard,
  FileText,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  type LucideIcon,
} from "lucide-react";

interface ProductPageProps {
  productCode: string;
}

const productIcons: Record<string, LucideIcon> = {
  FORMA: FileCheck,
  FORMNXP: FileSpreadsheet,
  PAAR: FileSearch,
  IMPORTLC: Ship,
  BFC: CreditCard,
  SHIPPINGDOC: FileText,
  LOAN: Landmark,
  INWCP: ArrowDownToLine,
  DOMOUTAC: ArrowUpFromLine,
};

const productColors: Record<string, string> = {
  FORMA: "bg-green-500",
  FORMNXP: "bg-teal-500",
  PAAR: "bg-orange-500",
  IMPORTLC: "bg-cyan-500",
  BFC: "bg-blue-500",
  SHIPPINGDOC: "bg-amber-500",
  LOAN: "bg-purple-500",
  INWCP: "bg-emerald-500",
  DOMOUTAC: "bg-rose-500",
};

export default function ProductPage({ productCode }: ProductPageProps) {
  const productInfo = productTypes[productCode as keyof typeof productTypes];
  const Icon = productIcons[productCode] || FileText;
  const colorClass = productColors[productCode] || "bg-gray-500";
  
  const transactions = mockTransactions.filter((tx) => tx.productType === productCode);
  const activeTransactions = transactions.filter((tx) =>
    ["pending", "under_review", "approved"].includes(tx.status)
  );
  const completedTransactions = transactions.filter((tx) =>
    ["completed", "cancelled", "rejected"].includes(tx.status)
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productInfo?.name || productCode}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorClass} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {productInfo?.name || productCode}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage {productInfo?.name.toLowerCase() || "transactions"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-card-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold mt-1">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-card-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-yellow-600">
              {transactions.filter((tx) => tx.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-card-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-2xl font-semibold mt-1 text-blue-600">
              {transactions.filter((tx) => tx.status === "under_review").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-card-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {completedTransactions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-card-border">
        <CardContent className="p-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active" data-testid="tab-active">
                Active ({activeTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" data-testid="tab-completed">
                Completed ({completedTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">
                All ({transactions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <TransactionTable
                transactions={activeTransactions}
                productType={productCode}
                showProductColumn={false}
                onCreateNew={() => {}}
              />
            </TabsContent>
            <TabsContent value="completed">
              <TransactionTable
                transactions={completedTransactions}
                productType={productCode}
                showProductColumn={false}
              />
            </TabsContent>
            <TabsContent value="all">
              <TransactionTable
                transactions={transactions}
                productType={productCode}
                showProductColumn={false}
                onCreateNew={() => {}}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
