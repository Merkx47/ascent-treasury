import { useState, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCog,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Eye,
  UserCheck,
  UserX,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { UserFormModal } from "@/components/UserFormModal";
import { mockUsers as initialMockUsers } from "@/lib/mockData";
import { UserRoles, Departments, UserStatuses } from "@/lib/permissions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialMockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, roleFilter, statusFilter, departmentFilter]);

  const activeUsers = filteredUsers.filter((u) => u.status === "Active");
  const inactiveUsers = filteredUsers.filter((u) => u.status !== "Active");

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedActiveUsers = activeUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedInactiveUsers = inactiveUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    inactive: users.filter((u) => u.status === "Inactive").length,
    pending: users.filter((u) => u.status === "Pending Activation").length,
  };

  const handleOpenModal = (user: any, mode: "view" | "edit" | "create") => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    if (modalMode === "create") {
      const newUser = {
        id: `user-${Date.now()}`,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        employeeId: userData.employeeId || `UBN-${Date.now().toString().slice(-6)}`,
        department: userData.department || "",
        branch: userData.branch || "",
        role: userData.role || "Maker",
        status: userData.status || "Pending Activation",
        permissions: userData.permissions || [],
        dailyLimit: userData.dailyLimit ? Number(userData.dailyLimit) : 0,
        approvalLimit: userData.approvalLimit ? Number(userData.approvalLimit) : 0,
        createdAt: new Date(),
        lastLoginAt: null,
      };
      setUsers([newUser, ...users]);
      toast({
        title: "User Created",
        description: `${newUser.firstName} ${newUser.lastName} has been added successfully`,
      });
    } else if (modalMode === "edit" && selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, ...userData }
            : u
        )
      );
      toast({
        title: "User Updated",
        description: `${userData.firstName || selectedUser.firstName} ${userData.lastName || selectedUser.lastName} has been updated`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (user: any) => {
    setUsers(users.filter((u) => u.id !== user.id));
    toast({
      title: "User Deleted",
      description: `${user.firstName} ${user.lastName} has been removed`,
      variant: "destructive",
    });
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    toast({
      title: newStatus === "Active" ? "User Activated" : "User Deactivated",
      description: `${user.firstName} ${user.lastName} is now ${newStatus.toLowerCase()}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      Active: { variant: "default", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      Inactive: { variant: "secondary", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
      Suspended: { variant: "destructive", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      "Pending Activation": { variant: "outline", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    };

    const config = statusConfig[status] || statusConfig.Inactive;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleStyles: Record<string, { border: string; text: string }> = {
      "Maker": { border: "#6b7280", text: "#374151" },
      "Checker": { border: "#3b82f6", text: "#2563eb" },
      "Supervisor": { border: "#f59e0b", text: "#d97706" },
      "Branch Manager": { border: "#f59e0b", text: "#d97706" },
      "Compliance Officer": { border: "#64748b", text: "#475569" },
      "Trade Officer": { border: "#14b8a6", text: "#0d9488" },
      "Relationship Manager": { border: "#6366f1", text: "#4f46e5" },
      "Administrator": { border: "#a855f7", text: "#9333ea" },
    };

    const style = roleStyles[role] || { border: "#d1d5db", text: "#6b7280" };

    return (
      <Badge
        variant="outline"
        style={{
          borderWidth: "2px",
          borderColor: style.border,
          borderStyle: "solid",
          color: style.text
        }}
      >
        {role}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const UserTable = ({ users, totalCount }: { users: typeof mockUsers; totalCount: number }) => (
    <div className="overflow-hidden border-2 border-gray-300 dark:border-gray-600 rounded-lg">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[280px] border-2 border-gray-300 dark:border-gray-600 font-semibold">User</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Employee ID</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Role</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Department</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Branch</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Status</TableHead>
            <TableHead className="border-2 border-gray-300 dark:border-gray-600 font-semibold">Last Login</TableHead>
            <TableHead className="text-right border-2 border-gray-300 dark:border-gray-600 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="border-2 border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm border-2 border-gray-300 dark:border-gray-600">{user.employeeId}</TableCell>
              <TableCell className="border-2 border-gray-300 dark:border-gray-600">{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-sm border-2 border-gray-300 dark:border-gray-600">{user.department}</TableCell>
              <TableCell className="text-sm text-muted-foreground border-2 border-gray-300 dark:border-gray-600">{user.branch}</TableCell>
              <TableCell className="border-2 border-gray-300 dark:border-gray-600">{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground border-2 border-gray-300 dark:border-gray-600">
                {user.lastLoginAt ? format(new Date(user.lastLoginAt), "dd MMM yyyy HH:mm") : "Never"}
              </TableCell>
              <TableCell className="text-right border-2 border-gray-300 dark:border-gray-600">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-2 border-border">
                    <DropdownMenuItem onClick={() => handleOpenModal(user, "view")}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenModal(user, "edit")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Permissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === "Active" ? (
                      <DropdownMenuItem className="text-amber-600" onClick={() => handleToggleStatus(user)}>
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600" onClick={() => handleToggleStatus(user)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground border-2 border-gray-300 dark:border-gray-600">
                No users found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-2"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(totalCount / itemsPerPage)) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={currentPage !== pageNum ? "border-2" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-2"
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalCount / itemsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2"
              onClick={() => setCurrentPage(Math.ceil(totalCount / itemsPerPage))}
              disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
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
            <BreadcrumbPage>User Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage system users, roles, and access permissions
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal(null, "create")}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <XCircle className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-border"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] border-2 border-border">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.values(UserRoles).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[200px] border-2 border-border">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {Departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-2 border-border">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(UserStatuses).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User Table with Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 border border-border">
          <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveUsers.length})</TabsTrigger>
        </TabsList>

        <Card className="border-2 border-border overflow-hidden">
          <TabsContent value="all" className="m-0">
            <UserTable users={paginatedUsers} totalCount={filteredUsers.length} />
          </TabsContent>
          <TabsContent value="active" className="m-0">
            <UserTable users={paginatedActiveUsers} totalCount={activeUsers.length} />
          </TabsContent>
          <TabsContent value="inactive" className="m-0">
            <UserTable users={paginatedInactiveUsers} totalCount={inactiveUsers.length} />
          </TabsContent>
        </Card>
      </Tabs>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        mode={modalMode}
        onSave={handleSaveUser}
      />
    </div>
  );
}
