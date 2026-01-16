import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionModal } from "@/components/TransactionModal";
import { getTransactionsByProduct, mockCustomers } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";
import { useAuth } from "@/hooks/use-auth";
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
import type { Transaction } from "@shared/schema";

interface ProductPageProps {
  productCode: string;
}

const productConfig: Record<string, { name: string; description: string }> = {
  FORMA: { name: "Form A", description: "Process invisible/service payments" },
  FORMNXP: { name: "Form NXP", description: "Export documentation management" },
  PAAR: { name: "PAAR", description: "Pre-Arrival Assessment Reports" },
  IMPORTLC: { name: "Import LC", description: "Letters of Credit for imports" },
  BFC: { name: "Bills for Collection", description: "Documentary collections" },
  SHIPPINGDOC: { name: "Shipping Documents", description: "Shipping documentation" },
  LOAN: { name: "Trade Loans", description: "Trade finance facilities" },
  INWCP: { name: "Inward Payments", description: "Incoming wire transfers" },
  DOMOUTAC: { name: "Outward Payments", description: "Outgoing wire transfers" },
};

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

// Generate unique reference number
const generateReferenceNumber = (productCode: string): string => {
  const prefix = productCode.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export default function ProductPage({ productCode }: ProductPageProps) {
  const { toast } = useToast();
  const { addToQueue } = useCheckerQueue();
  const { user } = useAuth();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mutable transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize transactions from mock data
  useEffect(() => {
    const initialData = getTransactionsByProduct(productCode);
    setTransactions(initialData);
  }, [productCode]);

  const productInfo = productConfig[productCode];
  const Icon = productIcons[productCode] || FileText;
  const colorClass = productColors[productCode] || "bg-gray-500";

  const activeTransactions = transactions.filter((tx) =>
    ["pending", "under_review", "approved"].includes(tx.status)
  );
  const completedTransactions = transactions.filter((tx) =>
    ["completed", "rejected"].includes(tx.status)
  );

  const handleView = (tx: Transaction) => {
    setSelectedTx(tx);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTx(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleDelete = (tx: Transaction) => {
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    setIsModalOpen(false);
    toast({
      title: "Transaction Deleted",
      description: `${tx.referenceNumber} has been deleted successfully.`,
    });
  };

  const handleDuplicate = (tx: Transaction) => {
    const duplicatedTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      referenceNumber: generateReferenceNumber(productCode),
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [duplicatedTx, ...prev]);
    toast({
      title: "Transaction Duplicated",
      description: `New draft created: ${duplicatedTx.referenceNumber}`,
    });
  };

  const handleSave = (data: Partial<Transaction>) => {
    if (modalMode === "create") {
      // Create new transaction
      const refNumber = generateReferenceNumber(productCode);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        referenceNumber: refNumber,
        productType: productCode,
        customerId: data.customerId || "",
        status: "pending",
        amount: data.amount || "0",
        currency: data.currency || "USD",
        description: data.description || "",
        priority: (data.priority as "low" | "normal" | "high" | "urgent") || "normal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);

      // Add to checker queue
      const customer = mockCustomers.find((c) => c.id === data.customerId);
      addToQueue({
        referenceNumber: refNumber,
        entityType: productCode,
        entityId: newTx.id,
        customerName: customer?.name || "Unknown Customer",
        amount: data.amount || "0",
        currency: data.currency || "USD",
        priority: (data.priority as "normal" | "high" | "urgent") || "normal",
        makerName: user ? `${user.firstName} ${user.lastName}` : "Current User",
        makerDepartment: "Trade Finance",
        makerComments: data.description || "",
      });

      toast({
        title: `${productInfo?.name || productCode} Created`,
        description: `${refNumber} has been created and submitted for checker approval.`,
      });
    } else if (modalMode === "edit" && selectedTx) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === selectedTx.id
            ? { ...tx, ...data, updatedAt: new Date().toISOString() }
            : tx
        )
      );
      toast({
        title: "Transaction Updated",
        description: `${selectedTx.referenceNumber} has been updated successfully.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteFromModal = (id: string) => {
    const txToDelete = transactions.find((tx) => tx.id === id);
    if (txToDelete) {
      handleDelete(txToDelete);
    }
  };

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
            {productInfo?.description || "Manage transactions"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold mt-1">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-yellow-600">
              {transactions.filter((tx) => tx.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-2xl font-semibold mt-1 text-blue-600">
              {transactions.filter((tx) => tx.status === "under_review").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {completedTransactions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 border border-border">
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
            title={`Active ${productInfo?.name || productCode}`}
            showProductColumn={false}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        </TabsContent>
        <TabsContent value="completed">
          <TransactionTable
            transactions={completedTransactions}
            title={`Completed ${productInfo?.name || productCode}`}
            showProductColumn={false}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </TabsContent>
        <TabsContent value="all">
          <TransactionTable
            transactions={transactions}
            title={`All ${productInfo?.name || productCode}`}
            showProductColumn={false}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        </TabsContent>
      </Tabs>

      <TransactionModal
        transaction={selectedTx}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDeleteFromModal}
        mode={modalMode}
        productType={productCode}
      />
    </div>
  );
}
