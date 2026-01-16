import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CurrencyIcon, formatFullAmount } from "./CurrencyIcon";
import { StatusBadge } from "./StatusBadge";
import { mockCustomers } from "@/lib/mockData";
import { format } from "date-fns";
import {
  FileText,
  Building2,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Save,
  Trash2,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

interface TransactionModalProps {
  transaction?: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: Partial<Transaction>) => void;
  onDelete?: (id: string) => void;
  mode: "view" | "edit" | "create";
  productType?: string;
}

const productLabels: Record<string, string> = {
  FORMM: "Form M",
  FORMA: "Form A",
  FORMNXP: "Form NXP",
  PAAR: "PAAR",
  IMPORTLC: "Import LC",
  BFC: "Bills for Collection",
  SHIPPINGDOC: "Shipping Docs",
  FXSALES: "FX Sales",
  LOAN: "Trade Loan",
  INWCP: "Inward Payment",
  DOMOUTAC: "Outward Payment",
};

export function TransactionModal({
  transaction,
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode,
  productType,
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    customerId: transaction?.customerId || "",
    amount: transaction?.amount || "",
    currency: transaction?.currency || "USD",
    description: transaction?.description || "",
    priority: transaction?.priority || "normal",
    status: transaction?.status || "draft",
  });

  const customer = transaction
    ? mockCustomers.find((c) => c.id === transaction.customerId)
    : null;

  const handleSubmit = () => {
    onSave?.({
      ...formData,
      productType: productType || transaction?.productType || "FORMM",
    });
    onClose();
  };

  const handleDelete = () => {
    if (transaction) {
      onDelete?.(transaction.id);
      onClose();
    }
  };

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? `New ${productLabels[productType || "FORMM"] || "Transaction"}`
      : mode === "edit"
      ? `Edit ${transaction?.referenceNumber}`
      : transaction?.referenceNumber || "Transaction Details";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-2 border-border">
        <DialogHeader className="border-b border-border pb-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">{title}</DialogTitle>
                <DialogDescription>
                  {mode === "create"
                    ? "Fill in the details to create a new transaction"
                    : mode === "edit"
                    ? "Update the transaction details"
                    : productLabels[transaction?.productType || ""] || "Transaction"}
                </DialogDescription>
              </div>
            </div>
            {transaction && <StatusBadge status={transaction.status} />}
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6 max-h-[calc(80vh-12rem)] overflow-y-auto">
          {isViewMode && transaction ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Building2 className="w-4 h-4" />
                    Customer
                  </div>
                  <p className="font-medium">{customer?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{customer?.accountNumber}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyIcon currency={transaction.currency || "USD"} />
                    <span className="font-mono text-lg font-bold">
                      {formatFullAmount(transaction.amount || "0", transaction.currency || "USD")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <FileText className="w-4 h-4" />
                  Description
                </div>
                <p className="text-sm">{transaction.description || "No description provided"}</p>
              </div>

              <Separator className="border-border" />

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <Calendar className="w-3 h-3" />
                    Created
                  </div>
                  <p className="font-medium text-sm">
                    {transaction.createdAt
                      ? format(new Date(transaction.createdAt), "dd MMM yyyy")
                      : "-"}
                  </p>
                </div>
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    Updated
                  </div>
                  <p className="font-medium text-sm">
                    {transaction.updatedAt
                      ? format(new Date(transaction.updatedAt), "dd MMM yyyy")
                      : "-"}
                  </p>
                </div>
                <div className="text-center p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <User className="w-3 h-3" />
                    Priority
                  </div>
                  <Badge
                    variant={
                      transaction.priority === "urgent"
                        ? "destructive"
                        : transaction.priority === "high"
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {transaction.priority}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customerId: value })
                    }
                  >
                    <SelectTrigger className="border-2 border-border" data-testid="select-customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.slice(0, 20).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger className="border-2 border-border" data-testid="select-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="Enter amount"
                    className="border-2 border-border"
                    data-testid="input-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger className="border-2 border-border" data-testid="select-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {mode === "edit" && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="border-2 border-border" data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description of goods or services"
                  className="min-h-[100px] border-2 border-border"
                  data-testid="input-description"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4 px-6 gap-3">
          {isViewMode ? (
            <Button variant="outline" onClick={onClose} className="border-border">
              Close
            </Button>
          ) : (
            <>
              {mode === "edit" && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="mr-auto"
                  data-testid="button-delete"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="border-border">
                Cancel
              </Button>
              <Button onClick={handleSubmit} data-testid="button-save">
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "Create" : "Save Changes"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
