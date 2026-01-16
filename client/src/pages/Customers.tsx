import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getInitials, maskAccountNumber } from "@/lib/utils";
import { mockCustomers as initialMockCustomers, mockTransactions, type MockCustomer } from "@/lib/mockData";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Mail,
  Phone,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Trash2,
} from "lucide-react";
import { exportToExcel, formatCustomerForExport } from "@/lib/exportUtils";
import { CustomerModal } from "@/components/CustomerModal";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<MockCustomer[]>(initialMockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<MockCustomer | null>(null);

  const customerTransactionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach((customer, index) => {
      const actualCount = mockTransactions.filter((tx) => tx.customerId === customer.id).length;
      counts[customer.id] = actualCount > 0 ? actualCount : ((index % 15) + 1);
    });
    return counts;
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.accountNumber.includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((customer) => {
        const txCount = customerTransactionCounts[customer.id] || 0;
        if (statusFilter === "active") return txCount > 5;
        if (statusFilter === "moderate") return txCount >= 2 && txCount <= 5;
        if (statusFilter === "new") return txCount < 2;
        return true;
      });
    }

    return result;
  }, [searchQuery, statusFilter, customerTransactionCounts, customers]);

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // CRUD Handlers
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer: MockCustomer) => {
    setSelectedCustomer(customer);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: MockCustomer) => {
    setSelectedCustomer(customer);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDuplicateCustomer = (customer: MockCustomer) => {
    const duplicatedCustomer: MockCustomer = {
      ...customer,
      id: `cust-${Date.now()}`,
      name: `${customer.name} (Copy)`,
      email: `copy.${customer.email}`,
      accountNumber: String(Math.floor(Math.random() * 9000000000) + 1000000000),
      totalTransactions: 0,
      totalVolume: 0,
    };
    setCustomers([duplicatedCustomer, ...customers]);
    toast({
      title: "Customer Duplicated",
      description: `Successfully created a copy of ${customer.name}`,
    });
  };

  const handleDeleteClick = (customer: MockCustomer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      toast({
        title: "Customer Deleted",
        description: `${customerToDelete.name} has been removed`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSaveCustomer = (customerData: Partial<MockCustomer>) => {
    if (modalMode === "create") {
      const newCustomer: MockCustomer = {
        id: customerData.id || `cust-${Date.now()}`,
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
        address: customerData.address || "",
        rcNumber: customerData.rcNumber || "",
        tin: customerData.tin || "",
        accountNumber: customerData.accountNumber || String(Math.floor(Math.random() * 9000000000) + 1000000000),
        accountName: customerData.accountName || customerData.name || "",
        relationshipManager: customerData.relationshipManager || "",
        sector: customerData.sector || "",
        status: customerData.status || "active",
        totalTransactions: 0,
        totalVolume: 0,
        currency: "NGN",
      };
      setCustomers([newCustomer, ...customers]);
      toast({
        title: "Customer Created",
        description: `${newCustomer.name} has been added successfully`,
      });
    } else if (modalMode === "edit" && selectedCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, ...customerData }
            : c
        )
      );
      toast({
        title: "Customer Updated",
        description: `${customerData.name || selectedCustomer.name} has been updated`,
      });
    }
    setIsModalOpen(false);
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
            <BreadcrumbPage>Customers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground">
              Manage corporate trade customers ({customers.length} total)
            </p>
          </div>
        </div>
        <Button onClick={handleAddCustomer} data-testid="button-add-customer">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="border-2 border-border">
        <CardHeader className="pb-4 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Customer Directory</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 border-2 border-border"
                  data-testid="input-search-customers"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-2 border-border" data-testid="select-status-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active (6+ txns)</SelectItem>
                  <SelectItem value="moderate">Moderate (2-5 txns)</SelectItem>
                  <SelectItem value="new">New (&lt;2 txns)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-2"
                onClick={() => {
                  const exportData = filteredCustomers.map(customer =>
                    formatCustomerForExport(customer, customerTransactionCounts[customer.id])
                  );
                  exportToExcel(exportData, "Customers_Export");
                }}
                data-testid="button-download-xlsx"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Customer</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Account</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">RC Number</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border">Contact</th>
                  <th className="text-center font-semibold text-sm px-4 py-3 border-2 border-border">Transactions</th>
                  <th className="text-left font-semibold text-sm px-4 py-3 border-2 border-border w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground border-2 border-border">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-testid={`row-customer-${customer.id}`}
                    >
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.address.split(",")[0]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <p className="font-mono text-sm">
                          {maskAccountNumber(customer.accountNumber)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.accountName}
                        </p>
                      </td>
                      <td className="font-mono text-sm px-4 py-3 border-2 border-border">
                        {customer.rcNumber}
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs truncate max-w-[150px]">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs">{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-4 py-3 border-2 border-border">
                        <span className="font-mono font-medium">
                          {customerTransactionCounts[customer.id]}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-2 border-border">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`button-actions-${customer.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateCustomer(customer)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(customer)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredCustomers.length)} of {filteredCustomers.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="border-2 border-border"
                data-testid="button-prev-page"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`w-8 ${page !== pageNum ? "border-2 border-border" : ""}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="border-2 border-border"
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        mode={modalMode}
        onSave={handleSaveCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{customerToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
