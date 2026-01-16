// User Roles for Union Bank Treasury Operations
export const UserRoles = {
  MAKER: "Maker",
  CHECKER: "Checker",
  SUPERVISOR: "Supervisor",
  TREASURER: "Treasurer",
  DEALER: "Dealer",
  SENIOR_DEALER: "Senior Dealer",
  RISK_OFFICER: "Risk Officer",
  MIDDLE_OFFICE: "Middle Office",
  BACK_OFFICE: "Back Office",
  COMPLIANCE_OFFICER: "Compliance Officer",
  ADMIN: "Administrator",
  SUPER_ADMIN: "Super Admin",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

// Granular Permissions for Treasury
export const Permissions = {
  // FX Trading Operations
  FX_VIEW: "fx:view",
  FX_CREATE: "fx:create",
  FX_EDIT: "fx:edit",
  FX_APPROVE: "fx:approve",
  FX_DELETE: "fx:delete",

  // Money Market Operations
  MM_VIEW: "mm:view",
  MM_CREATE: "mm:create",
  MM_EDIT: "mm:edit",
  MM_APPROVE: "mm:approve",
  MM_DELETE: "mm:delete",

  // Fixed Income Operations
  FI_VIEW: "fi:view",
  FI_CREATE: "fi:create",
  FI_EDIT: "fi:edit",
  FI_APPROVE: "fi:approve",
  FI_DELETE: "fi:delete",

  // Derivatives Operations
  DERIV_VIEW: "deriv:view",
  DERIV_CREATE: "deriv:create",
  DERIV_EDIT: "deriv:edit",
  DERIV_APPROVE: "deriv:approve",
  DERIV_DELETE: "deriv:delete",

  // Risk Management
  RISK_VIEW: "risk:view",
  RISK_MANAGE: "risk:manage",
  LIMITS_VIEW: "limits:view",
  LIMITS_MANAGE: "limits:manage",
  VAR_VIEW: "var:view",
  VAR_MANAGE: "var:manage",

  // Portfolio & Positions
  POSITIONS_VIEW: "positions:view",
  POSITIONS_MANAGE: "positions:manage",
  PNL_VIEW: "pnl:view",
  MATURITY_VIEW: "maturity:view",

  // Settlements & Back Office
  SETTLEMENTS_VIEW: "settlements:view",
  SETTLEMENTS_PROCESS: "settlements:process",
  CONFIRMATIONS_VIEW: "confirmations:view",
  CONFIRMATIONS_MANAGE: "confirmations:manage",
  ACCOUNTING_VIEW: "accounting:view",
  ACCOUNTING_POST: "accounting:post",

  // Counterparty Management
  COUNTERPARTY_VIEW: "counterparty:view",
  COUNTERPARTY_CREATE: "counterparty:create",
  COUNTERPARTY_EDIT: "counterparty:edit",
  COUNTERPARTY_DELETE: "counterparty:delete",
  COUNTERPARTY_APPROVE: "counterparty:approve",

  // User Management
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",
  USERS_ASSIGN_ROLES: "users:assign_roles",

  // Reports
  REPORTS_VIEW: "reports:view",
  REPORTS_EXPORT: "reports:export",
  REPORTS_REGULATORY: "reports:regulatory",
  REPORTS_CBN: "reports:cbn",

  // Checker Queue
  QUEUE_VIEW: "queue:view",
  QUEUE_APPROVE: "queue:approve",
  QUEUE_REJECT: "queue:reject",
  QUEUE_SEND_BACK: "queue:send_back",

  // Compliance
  COMPLIANCE_VIEW: "compliance:view",
  COMPLIANCE_MANAGE: "compliance:manage",

  // Settings
  SETTINGS_VIEW: "settings:view",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

// Role-Permission Mapping for Treasury
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRoles.MAKER]: [
    Permissions.FX_VIEW,
    Permissions.FX_CREATE,
    Permissions.FX_EDIT,
    Permissions.MM_VIEW,
    Permissions.MM_CREATE,
    Permissions.MM_EDIT,
    Permissions.FI_VIEW,
    Permissions.FI_CREATE,
    Permissions.FI_EDIT,
    Permissions.DERIV_VIEW,
    Permissions.DERIV_CREATE,
    Permissions.DERIV_EDIT,
    Permissions.POSITIONS_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
  ],
  [UserRoles.CHECKER]: [
    Permissions.FX_VIEW,
    Permissions.FX_APPROVE,
    Permissions.MM_VIEW,
    Permissions.MM_APPROVE,
    Permissions.FI_VIEW,
    Permissions.FI_APPROVE,
    Permissions.DERIV_VIEW,
    Permissions.DERIV_APPROVE,
    Permissions.POSITIONS_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.COUNTERPARTY_APPROVE,
    Permissions.REPORTS_VIEW,
    Permissions.QUEUE_VIEW,
    Permissions.QUEUE_APPROVE,
    Permissions.QUEUE_REJECT,
    Permissions.QUEUE_SEND_BACK,
  ],
  [UserRoles.DEALER]: [
    Permissions.FX_VIEW,
    Permissions.FX_CREATE,
    Permissions.FX_EDIT,
    Permissions.MM_VIEW,
    Permissions.MM_CREATE,
    Permissions.MM_EDIT,
    Permissions.POSITIONS_VIEW,
    Permissions.PNL_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
  ],
  [UserRoles.SENIOR_DEALER]: [
    Permissions.FX_VIEW,
    Permissions.FX_CREATE,
    Permissions.FX_EDIT,
    Permissions.FX_APPROVE,
    Permissions.MM_VIEW,
    Permissions.MM_CREATE,
    Permissions.MM_EDIT,
    Permissions.MM_APPROVE,
    Permissions.FI_VIEW,
    Permissions.FI_CREATE,
    Permissions.FI_EDIT,
    Permissions.DERIV_VIEW,
    Permissions.DERIV_CREATE,
    Permissions.DERIV_EDIT,
    Permissions.POSITIONS_VIEW,
    Permissions.POSITIONS_MANAGE,
    Permissions.PNL_VIEW,
    Permissions.MATURITY_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.COUNTERPARTY_CREATE,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.QUEUE_VIEW,
    Permissions.QUEUE_APPROVE,
    Permissions.QUEUE_REJECT,
  ],
  [UserRoles.SUPERVISOR]: [
    Permissions.FX_VIEW,
    Permissions.FX_CREATE,
    Permissions.FX_EDIT,
    Permissions.FX_APPROVE,
    Permissions.MM_VIEW,
    Permissions.MM_CREATE,
    Permissions.MM_EDIT,
    Permissions.MM_APPROVE,
    Permissions.FI_VIEW,
    Permissions.FI_CREATE,
    Permissions.FI_EDIT,
    Permissions.FI_APPROVE,
    Permissions.DERIV_VIEW,
    Permissions.DERIV_CREATE,
    Permissions.DERIV_EDIT,
    Permissions.DERIV_APPROVE,
    Permissions.RISK_VIEW,
    Permissions.LIMITS_VIEW,
    Permissions.POSITIONS_VIEW,
    Permissions.POSITIONS_MANAGE,
    Permissions.PNL_VIEW,
    Permissions.MATURITY_VIEW,
    Permissions.SETTLEMENTS_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.COUNTERPARTY_CREATE,
    Permissions.COUNTERPARTY_EDIT,
    Permissions.COUNTERPARTY_APPROVE,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.QUEUE_VIEW,
    Permissions.QUEUE_APPROVE,
    Permissions.QUEUE_REJECT,
    Permissions.QUEUE_SEND_BACK,
    Permissions.COMPLIANCE_VIEW,
  ],
  [UserRoles.TREASURER]: [
    ...Object.values(Permissions).filter(
      (p) => !p.startsWith("settings:") && !p.startsWith("users:")
    ),
  ],
  [UserRoles.RISK_OFFICER]: [
    Permissions.FX_VIEW,
    Permissions.MM_VIEW,
    Permissions.FI_VIEW,
    Permissions.DERIV_VIEW,
    Permissions.RISK_VIEW,
    Permissions.RISK_MANAGE,
    Permissions.LIMITS_VIEW,
    Permissions.LIMITS_MANAGE,
    Permissions.VAR_VIEW,
    Permissions.VAR_MANAGE,
    Permissions.POSITIONS_VIEW,
    Permissions.PNL_VIEW,
    Permissions.MATURITY_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.REPORTS_REGULATORY,
    Permissions.COMPLIANCE_VIEW,
  ],
  [UserRoles.MIDDLE_OFFICE]: [
    Permissions.FX_VIEW,
    Permissions.MM_VIEW,
    Permissions.FI_VIEW,
    Permissions.DERIV_VIEW,
    Permissions.RISK_VIEW,
    Permissions.LIMITS_VIEW,
    Permissions.VAR_VIEW,
    Permissions.POSITIONS_VIEW,
    Permissions.PNL_VIEW,
    Permissions.MATURITY_VIEW,
    Permissions.CONFIRMATIONS_VIEW,
    Permissions.CONFIRMATIONS_MANAGE,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.COMPLIANCE_VIEW,
  ],
  [UserRoles.BACK_OFFICE]: [
    Permissions.FX_VIEW,
    Permissions.MM_VIEW,
    Permissions.FI_VIEW,
    Permissions.DERIV_VIEW,
    Permissions.SETTLEMENTS_VIEW,
    Permissions.SETTLEMENTS_PROCESS,
    Permissions.CONFIRMATIONS_VIEW,
    Permissions.CONFIRMATIONS_MANAGE,
    Permissions.ACCOUNTING_VIEW,
    Permissions.ACCOUNTING_POST,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
  ],
  [UserRoles.COMPLIANCE_OFFICER]: [
    Permissions.FX_VIEW,
    Permissions.MM_VIEW,
    Permissions.FI_VIEW,
    Permissions.DERIV_VIEW,
    Permissions.RISK_VIEW,
    Permissions.LIMITS_VIEW,
    Permissions.POSITIONS_VIEW,
    Permissions.SETTLEMENTS_VIEW,
    Permissions.CONFIRMATIONS_VIEW,
    Permissions.COUNTERPARTY_VIEW,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.REPORTS_REGULATORY,
    Permissions.REPORTS_CBN,
    Permissions.QUEUE_VIEW,
    Permissions.COMPLIANCE_VIEW,
    Permissions.COMPLIANCE_MANAGE,
  ],
  [UserRoles.ADMIN]: [
    ...Object.values(Permissions).filter(
      (p) => !p.startsWith("settings:manage")
    ),
  ],
  [UserRoles.SUPER_ADMIN]: Object.values(Permissions),
};

// Permission Groups for UI Display
export const PermissionGroups = {
  "Trading & Execution": [
    { key: "fx", label: "FX Trading", permissions: ["view", "create", "edit", "approve", "delete"] },
    { key: "mm", label: "Money Market", permissions: ["view", "create", "edit", "approve", "delete"] },
    { key: "fi", label: "Fixed Income", permissions: ["view", "create", "edit", "approve", "delete"] },
    { key: "deriv", label: "Derivatives", permissions: ["view", "create", "edit", "approve", "delete"] },
  ],
  "Risk Management": [
    { key: "risk", label: "Risk Dashboard", permissions: ["view", "manage"] },
    { key: "limits", label: "Limit Management", permissions: ["view", "manage"] },
    { key: "var", label: "VAR Analysis", permissions: ["view", "manage"] },
  ],
  "Portfolio Management": [
    { key: "positions", label: "Positions", permissions: ["view", "manage"] },
    { key: "pnl", label: "P&L Report", permissions: ["view"] },
    { key: "maturity", label: "Maturity Ladder", permissions: ["view"] },
  ],
  "Back Office": [
    { key: "settlements", label: "Settlements", permissions: ["view", "process"] },
    { key: "confirmations", label: "Confirmations", permissions: ["view", "manage"] },
    { key: "accounting", label: "Accounting", permissions: ["view", "post"] },
    { key: "counterparty", label: "Counterparties", permissions: ["view", "create", "edit", "delete", "approve"] },
  ],
  "Administration": [
    { key: "users", label: "User Management", permissions: ["view", "create", "edit", "delete", "assign_roles"] },
    { key: "reports", label: "Reports", permissions: ["view", "export", "regulatory", "cbn"] },
    { key: "queue", label: "Checker Queue", permissions: ["view", "approve", "reject", "send_back"] },
    { key: "compliance", label: "Compliance", permissions: ["view", "manage"] },
    { key: "settings", label: "Settings", permissions: ["view", "manage"] },
  ],
};

// Department options for Union Bank Treasury
export const Departments = [
  "Treasury Operations",
  "FX Trading",
  "Money Market",
  "Fixed Income",
  "Derivatives",
  "Treasury Sales",
  "Risk Management",
  "Middle Office",
  "Back Office",
  "Treasury Compliance",
  "Treasury IT",
  "ALM",
] as const;

// Branch options
export const Branches = [
  "Head Office - Stallion Plaza",
  "Treasury Tower",
  "Marina Branch",
  "Victoria Island Branch",
  "Ikeja Branch",
  "Apapa Branch",
  "Port Harcourt Branch",
  "Abuja Branch",
  "Kano Branch",
  "Ibadan Branch",
] as const;

// Status options for users
export const UserStatuses = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  PENDING_ACTIVATION: "Pending Activation",
} as const;

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

// Helper function to check if a role has a permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}

// Helper function to get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return RolePermissions[role] ?? [];
}
