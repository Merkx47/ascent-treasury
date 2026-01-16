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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { type MockCheckerQueueItem } from "@/lib/mockData";
import { format } from "date-fns";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MockCheckerQueueItem | null;
  onAction: (action: "approve" | "reject" | "send_back", comments: string) => void;
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

export function ApprovalModal({ isOpen, onClose, item, onAction }: ApprovalModalProps) {
  const [comments, setComments] = useState("");
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | "send_back" | null>(null);

  if (!item) return null;

  const handleAction = (action: "approve" | "reject" | "send_back") => {
    if (action !== "approve" && !comments.trim()) {
      setActiveAction(action);
      return;
    }
    onAction(action, comments);
    setComments("");
    setActiveAction(null);
  };

  const formatAmount = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    if (currency === "NGN") {
      return `₦${num.toLocaleString()}`;
    }
    return `${currency} ${num.toLocaleString()}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "high":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const isPending = item.status === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-border max-h-[90vh]">
        <DialogHeader className="border-b border-border pb-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">Review Transaction</DialogTitle>
                <DialogDescription>
                  {productLabels[item.entityType]} - {item.referenceNumber}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.priority === "urgent" && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              {item.priority === "high" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  High Priority
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 max-h-[calc(80vh-12rem)] overflow-y-auto">
          {/* Transaction Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Building2 className="w-4 h-4" />
                  Customer
                </div>
                <p className="font-medium">{item.customerName}</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </div>
                <p className="font-mono text-lg font-bold">{formatAmount(item.amount, item.currency)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="border-2 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <FileText className="w-4 h-4" />
                Description
              </div>
              <p className="text-sm">{item.description}</p>
            </CardContent>
          </Card>

          <Separator />

          {/* Maker Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Submitted By
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border-2 border-border rounded-lg">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <User className="w-3 h-3" />
                  Maker
                </div>
                <p className="text-sm font-medium">{item.makerName}</p>
              </div>
              <div className="p-3 border-2 border-border rounded-lg">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Building2 className="w-3 h-3" />
                  Department
                </div>
                <p className="text-sm font-medium">{item.makerDepartment}</p>
              </div>
              <div className="p-3 border-2 border-border rounded-lg">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  Submitted
                </div>
                <p className="text-sm font-medium">{format(item.submittedAt, "dd MMM yyyy HH:mm")}</p>
              </div>
            </div>

            {item.makerComments && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Maker Comments:</p>
                <p className="text-sm">{item.makerComments}</p>
              </div>
            )}
          </div>

          {/* Previous Checker Action (if any) */}
          {item.status !== "pending" && item.checkerName && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Previous Review
                </h4>
                <div className="p-3 border-2 border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.checkerName}</span>
                    </div>
                    <Badge
                      variant={item.status === "approved" ? "default" : "destructive"}
                      className={item.status === "approved" ? "bg-green-100 text-green-700" : ""}
                    >
                      {item.status === "approved" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : item.status === "rejected" ? (
                        <XCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <RotateCcw className="w-3 h-3 mr-1" />
                      )}
                      {item.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                  {item.checkerComments && (
                    <p className="text-sm text-muted-foreground">{item.checkerComments}</p>
                  )}
                  {item.checkedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(item.checkedAt, "dd MMM yyyy HH:mm")}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Comments */}
          {isPending && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="comments">
                  Comments {activeAction && activeAction !== "approve" && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    activeAction === "reject"
                      ? "Please provide a reason for rejection..."
                      : activeAction === "send_back"
                      ? "Please specify what needs to be corrected..."
                      : "Add any comments for this action (optional for approval)..."
                  }
                  className="min-h-[100px] border-2 border-border"
                />
                {activeAction && activeAction !== "approve" && !comments.trim() && (
                  <p className="text-xs text-destructive">Comments are required for this action</p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4 px-6 gap-3 flex-wrap">
          <Button variant="outline" onClick={onClose} className="border-border">
            Close
          </Button>

          {isPending && (
            <>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => handleAction("send_back")}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Send Back
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAction("approve")}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
