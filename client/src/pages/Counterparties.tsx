import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  Landmark,
  Globe,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { counterparties } from "@/lib/mockData";
import { counterpartyTypes } from "@/lib/constants";
import { useCheckerQueue } from "@/contexts/CheckerQueueContext";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "NGN" ? "NGN" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getStatusBadge = (status: string) => {
  const config = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
    suspended: {
      label: "Suspended",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.inactive;
  return (
    <Badge className={`${statusConfig.className} border`} style={{ borderWidth: "1px" }}>
      {statusConfig.label}
    </Badge>
  );
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "BANK":
      return <Landmark className="w-4 h-4" />;
    case "CBN":
      return <Landmark className="w-4 h-4" />;
    case "CORP":
      return <Building2 className="w-4 h-4" />;
    case "GOVT":
      return <Globe className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

export default function Counterparties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<typeof counterparties[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { addToQueue } = useCheckerQueue();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    type: "",
    swiftCode: "",
    lei: "",
    country: "Nigeria",
    address: "",
    contactPerson: "",
    email: "",
    phone: "",
    tradingLimit: "",
    settlementLimit: "",
    status: "active",
  });

  // Filter counterparties
  const filteredCounterparties = useMemo(() => {
    return counterparties.filter(cp => {
      if (searchTerm && !cp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !cp.shortName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (typeFilter !== "all" && cp.type !== typeFilter) {
        return false;
      }
      if (statusFilter !== "all" && cp.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = counterparties.filter(cp => cp.status === "active").length;
    const banks = counterparties.filter(cp => cp.type === "BANK").length;
    const totalLimit = counterparties.reduce((sum, cp) => sum + (cp.tradingLimit || 0), 0);
    return { active, banks, totalLimit, total: counterparties.length };
  }, []);

  const handleViewDetail = (cp: typeof counterparties[0]) => {
    setSelectedCounterparty(cp);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const handleEdit = (cp: typeof counterparties[0]) => {
    setSelectedCounterparty(cp);
    setFormData({
      name: cp.name,
      shortName: cp.shortName,
      type: cp.type,
      swiftCode: cp.swiftCode || "",
      lei: cp.lei || "",
      country: cp.country,
      address: cp.address || "",
      contactPerson: cp.contactPerson || "",
      email: cp.email || "",
      phone: cp.phone || "",
      tradingLimit: cp.tradingLimit?.toString() || "",
      settlementLimit: cp.settlementLimit?.toString() || "",
      status: cp.status,
    });
    setIsEditing(true);
    setShowDetailModal(true);
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      shortName: "",
      type: "",
      swiftCode: "",
      lei: "",
      country: "Nigeria",
      address: "",
      contactPerson: "",
      email: "",
      phone: "",
      tradingLimit: "",
      settlementLimit: "",
      status: "active",
    });
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.shortName || !formData.type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const cpId = `CP-${Date.now()}`;

    addToQueue({
      referenceNumber: cpId,
      entityType: "COUNTERPARTY",
      entityId: cpId,
      action: isEditing ? "update" : "create",
      description: isEditing
        ? `Update counterparty: ${formData.name}`
        : `Create new counterparty: ${formData.name}`,
      customerName: formData.name,
      amount: String(parseFloat(formData.tradingLimit) || 0),
      currency: "USD",
      priority: "normal",
      makerId: "user-001",
      makerName: "Current User",
      makerDepartment: "Treasury Operations",
      makerComments: `${isEditing ? "Update" : "New"} counterparty: ${formData.shortName}`,
      checkerId: null,
      checkerName: null,
      checkerComments: null,
      checkedAt: null,
    });

    toast({
      title: "Submitted for Approval",
      description: `Counterparty ${isEditing ? "update" : "creation"} has been submitted to the checker queue`,
    });

    setShowCreateModal(false);
    setShowDetailModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Counterparties</h1>
          <p className="text-muted-foreground">
            Manage trading counterparties and limits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="border-2" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Counterparty
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Counterparties</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banks</p>
                <p className="text-2xl font-bold">{stats.banks}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Landmark className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trading Limit</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalLimit)}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or code..."
                  className="pl-10 border-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-40">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {counterpartyTypes.map(type => (
                    <SelectItem key={type.code} value={type.code}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Counterparties Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Counterparty List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2">
                <TableHead className="border-2 border-border font-semibold">Name</TableHead>
                <TableHead className="border-2 border-border font-semibold">Short Name</TableHead>
                <TableHead className="border-2 border-border font-semibold">Type</TableHead>
                <TableHead className="border-2 border-border font-semibold">SWIFT/BIC</TableHead>
                <TableHead className="border-2 border-border font-semibold">Country</TableHead>
                <TableHead className="border-2 border-border font-semibold text-right">Trading Limit</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Status</TableHead>
                <TableHead className="border-2 border-border font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCounterparties.map((cp) => (
                <TableRow key={cp.id} className="border-b-2">
                  <TableCell className="border-2 border-border font-medium">{cp.name}</TableCell>
                  <TableCell className="border-2 border-border font-mono">{cp.shortName}</TableCell>
                  <TableCell className="border-2 border-border">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(cp.type)}
                      <span>{counterpartyTypes.find(t => t.code === cp.type)?.name || cp.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="border-2 border-border font-mono">{cp.swiftCode || "-"}</TableCell>
                  <TableCell className="border-2 border-border">{cp.country}</TableCell>
                  <TableCell className="border-2 border-border text-right">
                    {cp.tradingLimit ? formatCurrency(cp.tradingLimit) : "-"}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    {getStatusBadge(cp.status)}
                  </TableCell>
                  <TableCell className="border-2 border-border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                        onClick={() => handleViewDetail(cp)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-2 border-border hover:bg-muted"
                        onClick={() => handleEdit(cp)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || (showDetailModal && isEditing)} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          if (isEditing) setShowDetailModal(false);
        }
      }}>
        <DialogContent className="max-w-2xl border-2 p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b-2 border-border px-6 py-4 flex-shrink-0">
            <DialogTitle className="text-lg font-semibold">
              {isEditing ? "Edit Counterparty" : "Add New Counterparty"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {/* Basic Information Section */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name *</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full legal name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Short Name *</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="Trading code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="border-2 mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {counterpartyTypes.map(type => (
                        <SelectItem key={type.code} value={type.code}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">SWIFT/BIC Code</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.swiftCode}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                    placeholder="e.g., ABORNGLA"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">LEI</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.lei}
                    onChange={(e) => setFormData({ ...formData, lei: e.target.value })}
                    placeholder="Legal Entity Identifier"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-sm font-medium">Address</Label>
                <Textarea
                  className="border-2 mt-1.5"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-t-2 border-border pt-5">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    className="border-2 mt-1.5"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  className="border-2 mt-1.5"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Trading Limits Section */}
            <div className="border-t-2 border-border pt-5">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Trading Limits (USD)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Trading Limit</Label>
                  <Input
                    type="number"
                    className="border-2 mt-1.5"
                    value={formData.tradingLimit}
                    onChange={(e) => setFormData({ ...formData, tradingLimit: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Settlement Limit</Label>
                  <Input
                    type="number"
                    className="border-2 mt-1.5"
                    value={formData.settlementLimit}
                    onChange={(e) => setFormData({ ...formData, settlementLimit: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="border-t-2 border-border pt-5">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Status</h4>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-2 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t-2 border-border px-6 py-4 flex justify-end gap-3 flex-shrink-0 bg-muted/30">
            <Button
              variant="outline"
              className="border-2"
              onClick={() => {
                setShowCreateModal(false);
                if (isEditing) setShowDetailModal(false);
              }}
            >
              Cancel
            </Button>
            <Button className="border-2" onClick={handleSubmit}>
              Submit for Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Detail Modal */}
      <Dialog open={showDetailModal && !isEditing} onOpenChange={(open) => {
        if (!open) setShowDetailModal(false);
      }}>
        <DialogContent className="max-w-2xl border-2 p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b-2 border-border px-6 py-4 flex-shrink-0">
            <DialogTitle className="text-lg font-semibold">Counterparty Details</DialogTitle>
          </DialogHeader>
          {selectedCounterparty && (
            <>
              <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Name</label>
                      <p className="font-semibold mt-1">{selectedCounterparty.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Short Name</label>
                      <p className="font-semibold font-mono mt-1">{selectedCounterparty.shortName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Type</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(selectedCounterparty.type)}
                        <span className="font-semibold">{counterpartyTypes.find(t => t.code === selectedCounterparty.type)?.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedCounterparty.status)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm text-muted-foreground">SWIFT/BIC</label>
                      <p className="font-semibold font-mono mt-1">{selectedCounterparty.swiftCode || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">LEI</label>
                      <p className="font-semibold font-mono mt-1">{selectedCounterparty.lei || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Country</label>
                      <p className="font-semibold mt-1">{selectedCounterparty.country}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Address</label>
                      <p className="font-semibold mt-1">{selectedCounterparty.address || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Trading Limits */}
                <div className="border-t-2 border-border pt-5">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Trading Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Trading Limit</label>
                      <p className="font-semibold mt-1">
                        {selectedCounterparty.tradingLimit
                          ? formatCurrency(selectedCounterparty.tradingLimit)
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Settlement Limit</label>
                      <p className="font-semibold mt-1">
                        {selectedCounterparty.settlementLimit
                          ? formatCurrency(selectedCounterparty.settlementLimit)
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t-2 border-border px-6 py-4 flex justify-end gap-3 flex-shrink-0 bg-muted/30">
                <Button variant="outline" className="border-2" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
                <Button className="border-2" onClick={() => handleEdit(selectedCounterparty)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
