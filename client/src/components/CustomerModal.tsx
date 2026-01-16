import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Briefcase,
} from "lucide-react";
import type { MockCustomer } from "@/lib/mockData";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: MockCustomer | null;
  mode: "view" | "edit" | "create";
  onSave?: (customer: Partial<MockCustomer>) => void;
}

const sectors = [
  "Manufacturing",
  "Banking",
  "Oil & Gas",
  "Telecommunications",
  "Agriculture",
  "Healthcare",
  "FMCG",
  "Construction",
  "Aviation",
  "Fintech",
  "Real Estate",
  "Retail",
  "Technology",
  "Logistics",
];

export function CustomerModal({ isOpen, onClose, customer, mode, onSave }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    rcNumber: "",
    tin: "",
    accountNumber: "",
    accountName: "",
    relationshipManager: "",
    sector: "",
    status: "active",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        rcNumber: customer.rcNumber || "",
        tin: customer.tin || "",
        accountNumber: customer.accountNumber || "",
        accountName: customer.accountName || "",
        relationshipManager: customer.relationshipManager || "",
        sector: customer.sector || "",
        status: customer.status || "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        rcNumber: "",
        tin: "",
        accountNumber: "",
        accountName: "",
        relationshipManager: "",
        sector: "",
        status: "active",
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = () => {
    if (onSave) {
      onSave({
        ...formData,
        id: customer?.id || `cust-${Date.now()}`,
        totalTransactions: customer?.totalTransactions || 0,
        totalVolume: customer?.totalVolume || 0,
        currency: customer?.currency || "NGN",
      });
    }
    onClose();
  };

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Add New Customer" : mode === "edit" ? "Edit Customer" : "Customer Details";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-border h-[85vh] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-border pb-4 px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Add a new corporate trade customer"
                  : mode === "edit"
                  ? "Update customer information"
                  : customer?.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <div className="py-4 space-y-6 pr-2">
            {/* Company Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rcNumber">
                    <FileText className="w-4 h-4 inline mr-2" />
                    RC Number
                  </Label>
                  <Input
                    id="rcNumber"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border font-mono"
                    placeholder="RC XXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tin">TIN</Label>
                  <Input
                    id="tin"
                    value={formData.tin}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border font-mono"
                    placeholder="Tax Identification Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Sector
                  </Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="company@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Account Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border font-mono"
                    placeholder="XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="Account holder name"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="relationshipManager">Relationship Manager</Label>
                  <Input
                    id="relationshipManager"
                    value={formData.relationshipManager}
                    onChange={(e) => setFormData({ ...formData, relationshipManager: e.target.value })}
                    disabled={isViewMode}
                    className="border-2 border-border"
                    placeholder="RM name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4 px-6 gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="border-border">
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Customer" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
