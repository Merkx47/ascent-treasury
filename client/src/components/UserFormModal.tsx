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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCog,
  Save,
  User,
  Building2,
  Shield,
  DollarSign,
  Mail,
  Phone,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import {
  UserRoles,
  Departments,
  Branches,
  UserStatuses,
  PermissionGroups,
  getRolePermissions,
  type UserRole,
} from "@/lib/permissions";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  mode: "view" | "edit" | "create";
  onSave?: (userData: any) => void;
}

export function UserFormModal({ isOpen, onClose, user, mode, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeId: "",
    department: "",
    branch: "",
    role: "",
    status: "Pending Activation",
    dailyLimit: "",
    approvalLimit: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        employeeId: user.employeeId || "",
        department: user.department || "",
        branch: user.branch || "",
        role: user.role || "",
        status: user.status || "Active",
        dailyLimit: user.dailyLimit?.toString() || "",
        approvalLimit: user.approvalLimit?.toString() || "",
        permissions: user.permissions || [],
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        employeeId: "",
        department: "",
        branch: "",
        role: "",
        status: "Pending Activation",
        dailyLimit: "",
        approvalLimit: "",
        permissions: [],
      });
    }
  }, [user, isOpen]);

  const handleRoleChange = (role: string) => {
    // Auto-populate permissions based on role
    const rolePermissions = getRolePermissions(role as UserRole);
    setFormData({
      ...formData,
      role,
      permissions: rolePermissions,
    });
  };

  const handlePermissionToggle = (permission: string) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter((p) => p !== permission)
      : [...formData.permissions, permission];
    setFormData({ ...formData, permissions: newPermissions });
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Add New User" : mode === "edit" ? "Edit User" : "User Details";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-2 border-border h-[85vh] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-border pb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Create a new user account with role and permissions"
                  : mode === "edit"
                  ? "Update user information and access rights"
                  : `${user?.firstName} ${user?.lastName}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 min-h-0 flex-1 overflow-hidden">
          <Tabs defaultValue="personal" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4 flex-shrink-0">
              <TabsTrigger value="personal">
                <User className="w-4 h-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="organization">
                <Building2 className="w-4 h-4 mr-2" />
                Organization
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Shield className="w-4 h-4 mr-2" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="limits">
                <DollarSign className="w-4 h-4 mr-2" />
                Limits
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 overflow-y-auto pr-4 pb-4">
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4 mt-0 px-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={isViewMode}
                      className="border-2 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={isViewMode}
                      className="border-2 border-border"
                    />
                  </div>
                </div>

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
                    placeholder="name@unionbank.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">
                      <BadgeCheck className="w-4 h-4 inline mr-2" />
                      Employee ID
                    </Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      disabled={isViewMode}
                      className="border-2 border-border font-mono"
                      placeholder="UBN-XXX-XXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {Object.values(UserStatuses).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Organization Tab */}
              <TabsContent value="organization" className="space-y-4 mt-0 px-1">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    <Shield className="w-4 h-4 inline mr-2" />
                    User Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {Object.values(UserRoles).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Role determines base permissions. You can customize permissions in the next tab.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {Departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Branch
                  </Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => setFormData({ ...formData, branch: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {Branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions" className="space-y-4 mt-0 px-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Permission Matrix</h4>
                    <p className="text-xs text-muted-foreground">
                      Customize individual permissions for this user
                    </p>
                  </div>
                  <Badge variant="outline" className="border-2">
                    {formData.permissions.length} permissions granted
                  </Badge>
                </div>

                {Object.entries(PermissionGroups).map(([group, items]) => (
                  <div key={group} className="space-y-3">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      {group}
                    </h5>
                    <div className="border-2 border-border rounded-lg p-4 space-y-3">
                      {items.map((item) => (
                        <div key={item.key} className="space-y-2">
                          <p className="text-sm font-medium">{item.label}</p>
                          <div className="flex flex-wrap gap-3">
                            {item.permissions.map((perm) => {
                              const permKey = `${item.key}:${perm}`;
                              const isChecked = formData.permissions.includes(permKey);
                              return (
                                <div key={permKey} className="flex items-center gap-2">
                                  <Checkbox
                                    id={permKey}
                                    checked={isChecked}
                                    onCheckedChange={() => handlePermissionToggle(permKey)}
                                    disabled={isViewMode}
                                  />
                                  <label
                                    htmlFor={permKey}
                                    className="text-sm capitalize cursor-pointer"
                                  >
                                    {perm.replace("_", " ")}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Limits Tab */}
              <TabsContent value="limits" className="space-y-4 mt-0 px-1">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Transaction Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Set daily transaction and approval limits for this user.
                    These limits are enforced across all modules.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Transaction Limit (NGN)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      id="dailyLimit"
                      type="number"
                      value={formData.dailyLimit}
                      onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
                      disabled={isViewMode}
                      className="border-2 border-border pl-8 font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum total value of transactions this user can initiate per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalLimit">Single Approval Limit (NGN)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      id="approvalLimit"
                      type="number"
                      value={formData.approvalLimit}
                      onChange={(e) => setFormData({ ...formData, approvalLimit: e.target.value })}
                      disabled={isViewMode}
                      className="border-2 border-border pl-8 font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum value of a single transaction this user can approve
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Daily Limit</p>
                    <p className="text-lg font-mono font-bold">
                      ₦{formData.dailyLimit ? Number(formData.dailyLimit).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="p-4 border-2 border-border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Approval Limit</p>
                    <p className="text-lg font-mono font-bold">
                      ₦{formData.approvalLimit ? Number(formData.approvalLimit).toLocaleString() : "0"}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="border-t border-border pt-4 px-6 gap-3">
          <Button variant="outline" onClick={onClose} className="border-border">
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
