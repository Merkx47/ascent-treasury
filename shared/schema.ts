import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

// Enums as const objects for type safety
export const TransactionStatus = {
  DRAFT: "draft",
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXCEPTION: "exception",
} as const;

export const ProductType = {
  BFC: "BFC",
  FORMA: "FORMA",
  LOAN: "LOAN",
  PAAR: "PAAR",
  FORMNXP: "FORMNXP",
  FORMM: "FORMM",
  FXSALES: "FXSALES",
  IMPORTLC: "IMPORTLC",
  SHIPPINGDOC: "SHIPPINGDOC",
  INWCP: "INWCP",
  DOMOUTAC: "DOMOUTAC",
} as const;

export const UserRole = {
  CUSTOMER: "customer",
  RELATIONSHIP_MANAGER: "relationship_manager",
  TRADE_OFFICER: "trade_officer",
  COMPLIANCE_OFFICER: "compliance_officer",
  ADMIN: "admin",
} as const;

export const FxTradeType = {
  SPOT: "spot",
  FORWARD: "forward",
  SWAP: "swap",
  NDF: "ndf",
} as const;

export const Currency = {
  NGN: "NGN",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  CNY: "CNY",
} as const;

// User Profiles (extends auth users)
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull().default("customer"),
  department: varchar("department"),
  employeeId: varchar("employee_id"),
  phone: varchar("phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  rcNumber: varchar("rc_number"),
  tin: varchar("tin"),
  bvn: varchar("bvn"),
  accountNumber: varchar("account_number"),
  accountName: varchar("account_name"),
  bankCode: varchar("bank_code"),
  relationshipManagerId: varchar("relationship_manager_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_customers_rm").on(table.relationshipManagerId),
]);

// Base Transactions Table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referenceNumber: varchar("reference_number").notNull().unique(),
  productType: varchar("product_type").notNull(),
  customerId: varchar("customer_id").notNull(),
  status: varchar("status").notNull().default("draft"),
  amount: decimal("amount", { precision: 18, scale: 2 }),
  currency: varchar("currency").default("NGN"),
  description: text("description"),
  metadata: jsonb("metadata"),
  assignedTo: varchar("assigned_to"),
  priority: varchar("priority").default("normal"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_transactions_customer").on(table.customerId),
  index("idx_transactions_status").on(table.status),
  index("idx_transactions_product").on(table.productType),
  index("idx_transactions_assigned").on(table.assignedTo),
]);

// Form M (Import Documentation)
export const formM = pgTable("form_m", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  formMNumber: varchar("form_m_number"),
  nswRegistrationNumber: varchar("nsw_registration_number"),
  baNumber: varchar("ba_number"),
  importerName: varchar("importer_name").notNull(),
  importerAddress: text("importer_address"),
  importerRcNumber: varchar("importer_rc_number"),
  supplierName: varchar("supplier_name").notNull(),
  supplierAddress: text("supplier_address"),
  supplierCountry: varchar("supplier_country"),
  goodsDescription: text("goods_description").notNull(),
  hsCode: varchar("hs_code"),
  quantity: decimal("quantity", { precision: 18, scale: 4 }),
  unit: varchar("unit"),
  invoiceValue: decimal("invoice_value", { precision: 18, scale: 2 }),
  currency: varchar("currency").default("USD"),
  freightCharges: decimal("freight_charges", { precision: 18, scale: 2 }),
  insuranceCharges: decimal("insurance_charges", { precision: 18, scale: 2 }),
  otherCharges: decimal("other_charges", { precision: 18, scale: 2 }),
  totalCifValue: decimal("total_cif_value", { precision: 18, scale: 2 }),
  portOfLoading: varchar("port_of_loading"),
  portOfDischarge: varchar("port_of_discharge"),
  countryOfOrigin: varchar("country_of_origin"),
  validityDate: timestamp("validity_date"),
  registrationDate: timestamp("registration_date"),
  expiryDate: timestamp("expiry_date"),
  proformaInvoiceNumber: varchar("proforma_invoice_number"),
  proformaInvoiceDate: timestamp("proforma_invoice_date"),
  paymentTerms: varchar("payment_terms"),
  cbcApprovalStatus: varchar("cbc_approval_status"),
  sanctionsScreeningResult: varchar("sanctions_screening_result"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form A (Invisibles)
export const formA = pgTable("form_a", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  formANumber: varchar("form_a_number"),
  nswRegistrationNumber: varchar("nsw_registration_number"),
  applicantName: varchar("applicant_name").notNull(),
  applicantAddress: text("applicant_address"),
  beneficiaryName: varchar("beneficiary_name").notNull(),
  beneficiaryAddress: text("beneficiary_address"),
  beneficiaryCountry: varchar("beneficiary_country"),
  beneficiaryBank: varchar("beneficiary_bank"),
  beneficiaryAccountNumber: varchar("beneficiary_account_number"),
  purposeOfPayment: text("purpose_of_payment").notNull(),
  paymentCategory: varchar("payment_category"),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 6 }),
  ngnEquivalent: decimal("ngn_equivalent", { precision: 18, scale: 2 }),
  validityDate: timestamp("validity_date"),
  registrationDate: timestamp("registration_date"),
  expiryDate: timestamp("expiry_date"),
  cbcApprovalStatus: varchar("cbc_approval_status"),
  sanctionsScreeningResult: varchar("sanctions_screening_result"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PAAR (Pre-Arrival Assessment Report)
export const paar = pgTable("paar", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  paarNumber: varchar("paar_number"),
  formMNumber: varchar("form_m_number"),
  consignmentNumber: varchar("consignment_number"),
  importerName: varchar("importer_name").notNull(),
  importerTin: varchar("importer_tin"),
  shippingCompany: varchar("shipping_company"),
  vesselName: varchar("vessel_name"),
  billOfLadingNumber: varchar("bill_of_lading_number"),
  billOfLadingDate: timestamp("bill_of_lading_date"),
  portOfLoading: varchar("port_of_loading"),
  portOfDischarge: varchar("port_of_discharge"),
  expectedArrivalDate: timestamp("expected_arrival_date"),
  goodsDescription: text("goods_description"),
  hsCode: varchar("hs_code"),
  quantity: decimal("quantity", { precision: 18, scale: 4 }),
  weight: decimal("weight", { precision: 18, scale: 4 }),
  invoiceValue: decimal("invoice_value", { precision: 18, scale: 2 }),
  currency: varchar("currency").default("USD"),
  assessedDuty: decimal("assessed_duty", { precision: 18, scale: 2 }),
  assessedVat: decimal("assessed_vat", { precision: 18, scale: 2 }),
  totalAssessment: decimal("total_assessment", { precision: 18, scale: 2 }),
  nswValidationStatus: varchar("nsw_validation_status"),
  validationDate: timestamp("validation_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form NXP (Export Documentation)
export const formNxp = pgTable("form_nxp", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  nxpNumber: varchar("nxp_number"),
  nswRegistrationNumber: varchar("nsw_registration_number"),
  exporterName: varchar("exporter_name").notNull(),
  exporterAddress: text("exporter_address"),
  exporterRcNumber: varchar("exporter_rc_number"),
  buyerName: varchar("buyer_name").notNull(),
  buyerAddress: text("buyer_address"),
  buyerCountry: varchar("buyer_country"),
  goodsDescription: text("goods_description").notNull(),
  hsCode: varchar("hs_code"),
  quantity: decimal("quantity", { precision: 18, scale: 4 }),
  unit: varchar("unit"),
  fobValue: decimal("fob_value", { precision: 18, scale: 2 }),
  currency: varchar("currency").default("USD"),
  portOfLoading: varchar("port_of_loading"),
  portOfDischarge: varchar("port_of_discharge"),
  destinationCountry: varchar("destination_country"),
  validityDate: timestamp("validity_date"),
  registrationDate: timestamp("registration_date"),
  expectedRepatriationDate: timestamp("expected_repatriation_date"),
  repatriationStatus: varchar("repatriation_status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bills for Collection
export const billsForCollection = pgTable("bills_for_collection", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  collectionReference: varchar("collection_reference"),
  drawerName: varchar("drawer_name").notNull(),
  drawerAddress: text("drawer_address"),
  drawerBank: varchar("drawer_bank"),
  draweeNname: varchar("drawee_name").notNull(),
  draweeAddress: text("drawee_address"),
  draweeBank: varchar("drawee_bank"),
  collectingBank: varchar("collecting_bank"),
  collectingBankSwift: varchar("collecting_bank_swift"),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  tenor: varchar("tenor"),
  maturityDate: timestamp("maturity_date"),
  collectionType: varchar("collection_type"),
  documentsAttached: text("documents_attached").array(),
  swiftMessageRef: varchar("swift_message_ref"),
  mt4xxSent: boolean("mt4xx_sent").default(false),
  mt4xxSentDate: timestamp("mt4xx_sent_date"),
  proceedsReceived: boolean("proceeds_received").default(false),
  proceedsReceivedDate: timestamp("proceeds_received_date"),
  proceedsAmount: decimal("proceeds_amount", { precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Import Letter of Credit
export const importLc = pgTable("import_lc", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  lcNumber: varchar("lc_number"),
  formMNumber: varchar("form_m_number"),
  applicantName: varchar("applicant_name").notNull(),
  applicantAddress: text("applicant_address"),
  beneficiaryName: varchar("beneficiary_name").notNull(),
  beneficiaryAddress: text("beneficiary_address"),
  beneficiaryCountry: varchar("beneficiary_country"),
  advisingBank: varchar("advising_bank"),
  advisingBankSwift: varchar("advising_bank_swift"),
  confirmingBank: varchar("confirming_bank"),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  tolerance: decimal("tolerance", { precision: 5, scale: 2 }),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  expiryPlace: varchar("expiry_place"),
  latestShipmentDate: timestamp("latest_shipment_date"),
  goodsDescription: text("goods_description"),
  portOfLoading: varchar("port_of_loading"),
  portOfDischarge: varchar("port_of_discharge"),
  incoterms: varchar("incoterms"),
  documentsRequired: text("documents_required").array(),
  paymentTerms: varchar("payment_terms"),
  partialShipments: varchar("partial_shipments"),
  transshipment: varchar("transshipment"),
  mt7xxRef: varchar("mt7xx_ref"),
  mt7xxSent: boolean("mt7xx_sent").default(false),
  mt7xxSentDate: timestamp("mt7xx_sent_date"),
  amendmentCount: integer("amendment_count").default(0),
  utilizationAmount: decimal("utilization_amount", { precision: 18, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FX Trades
export const fxTrades = pgTable("fx_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  tradeReference: varchar("trade_reference"),
  tradeType: varchar("trade_type").notNull(),
  buyCurrency: varchar("buy_currency").notNull(),
  sellCurrency: varchar("sell_currency").notNull(),
  buyAmount: decimal("buy_amount", { precision: 18, scale: 2 }).notNull(),
  sellAmount: decimal("sell_amount", { precision: 18, scale: 2 }).notNull(),
  spotRate: decimal("spot_rate", { precision: 18, scale: 6 }),
  forwardPoints: decimal("forward_points", { precision: 18, scale: 6 }),
  allInRate: decimal("all_in_rate", { precision: 18, scale: 6 }),
  valueDate: timestamp("value_date").notNull(),
  maturityDate: timestamp("maturity_date"),
  counterparty: varchar("counterparty"),
  traderId: varchar("trader_id"),
  dealerName: varchar("dealer_name"),
  purpose: text("purpose"),
  underlyingTransaction: varchar("underlying_transaction"),
  limitCheckStatus: varchar("limit_check_status"),
  riskApprovalStatus: varchar("risk_approval_status"),
  settlementStatus: varchar("settlement_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trade Loans
export const tradeLoans = pgTable("trade_loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  loanReference: varchar("loan_reference"),
  borrowerName: varchar("borrower_name").notNull(),
  borrowerAccountNumber: varchar("borrower_account_number"),
  loanType: varchar("loan_type").notNull(),
  principalAmount: decimal("principal_amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("NGN"),
  interestRate: decimal("interest_rate", { precision: 8, scale: 4 }),
  tenor: integer("tenor"),
  tenorUnit: varchar("tenor_unit").default("days"),
  drawdownDate: timestamp("drawdown_date"),
  maturityDate: timestamp("maturity_date"),
  repaymentSchedule: jsonb("repayment_schedule"),
  collateralType: varchar("collateral_type"),
  collateralValue: decimal("collateral_value", { precision: 18, scale: 2 }),
  collateralDescription: text("collateral_description"),
  underlyingTradeRef: varchar("underlying_trade_ref"),
  creditScore: integer("credit_score"),
  creditDecision: varchar("credit_decision"),
  disbursedAmount: decimal("disbursed_amount", { precision: 18, scale: 2 }).default("0"),
  repaidAmount: decimal("repaid_amount", { precision: 18, scale: 2 }).default("0"),
  outstandingBalance: decimal("outstanding_balance", { precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inward Customer Payments
export const inwardPayments = pgTable("inward_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  paymentReference: varchar("payment_reference"),
  swiftMessageRef: varchar("swift_message_ref"),
  senderName: varchar("sender_name").notNull(),
  senderAddress: text("sender_address"),
  senderBank: varchar("sender_bank"),
  senderBankSwift: varchar("sender_bank_swift"),
  senderCountry: varchar("sender_country"),
  beneficiaryName: varchar("beneficiary_name").notNull(),
  beneficiaryAccountNumber: varchar("beneficiary_account_number"),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 6 }),
  ngnEquivalent: decimal("ngn_equivalent", { precision: 18, scale: 2 }),
  valueDate: timestamp("value_date"),
  purposeOfPayment: text("purpose_of_payment"),
  sanctionsScreeningResult: varchar("sanctions_screening_result"),
  amlCheckResult: varchar("aml_check_result"),
  creditedDate: timestamp("credited_date"),
  creditedAmount: decimal("credited_amount", { precision: 18, scale: 2 }),
  charges: decimal("charges", { precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Domiciliary Outward Payments
export const domOutwardPayments = pgTable("dom_outward_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  paymentReference: varchar("payment_reference"),
  remitterName: varchar("remitter_name").notNull(),
  remitterAccountNumber: varchar("remitter_account_number"),
  beneficiaryName: varchar("beneficiary_name").notNull(),
  beneficiaryAddress: text("beneficiary_address"),
  beneficiaryBank: varchar("beneficiary_bank"),
  beneficiaryBankSwift: varchar("beneficiary_bank_swift"),
  beneficiaryAccountNumber: varchar("beneficiary_account_number"),
  beneficiaryCountry: varchar("beneficiary_country"),
  intermediaryBank: varchar("intermediary_bank"),
  intermediaryBankSwift: varchar("intermediary_bank_swift"),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  charges: decimal("charges", { precision: 18, scale: 2 }),
  chargeBearer: varchar("charge_bearer").default("SHA"),
  purposeOfPayment: text("purpose_of_payment"),
  valueDate: timestamp("value_date"),
  swiftMessageRef: varchar("swift_message_ref"),
  swiftMessageSent: boolean("swift_message_sent").default(false),
  swiftMessageSentDate: timestamp("swift_message_sent_date"),
  sanctionsScreeningResult: varchar("sanctions_screening_result"),
  regulatoryApproval: varchar("regulatory_approval"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipping Documents
export const shippingDocuments = pgTable("shipping_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  documentType: varchar("document_type").notNull(),
  documentNumber: varchar("document_number"),
  documentDate: timestamp("document_date"),
  issuer: varchar("issuer"),
  description: text("description"),
  filePath: varchar("file_path"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  verificationStatus: varchar("verification_status").default("pending"),
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  discrepancies: text("discrepancies").array(),
  ocrExtractedData: jsonb("ocr_extracted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workflow Steps
export const workflowSteps = pgTable("workflow_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  stepNumber: integer("step_number").notNull(),
  stepName: varchar("step_name").notNull(),
  status: varchar("status").notNull().default("pending"),
  assignedTo: varchar("assigned_to"),
  assignedRole: varchar("assigned_role"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  comments: text("comments"),
  actionTaken: varchar("action_taken"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_workflow_transaction").on(table.transactionId),
]);

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id"),
  entityType: varchar("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  action: varchar("action").notNull(),
  userId: varchar("user_id"),
  userName: varchar("user_name"),
  userRole: varchar("user_role"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_audit_entity").on(table.entityType, table.entityId),
  index("idx_audit_transaction").on(table.transactionId),
]);

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  transactionId: varchar("transaction_id"),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_notifications_user").on(table.userId),
]);

// SWIFT Messages
export const swiftMessages = pgTable("swift_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  messageType: varchar("message_type").notNull(),
  direction: varchar("direction").notNull(),
  senderBic: varchar("sender_bic"),
  receiverBic: varchar("receiver_bic"),
  messageContent: text("message_content"),
  status: varchar("status").default("pending"),
  sentAt: timestamp("sent_at"),
  receivedAt: timestamp("received_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  errorDetails: text("error_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Compliance Checks
export const complianceChecks = pgTable("compliance_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  checkType: varchar("check_type").notNull(),
  entityName: varchar("entity_name"),
  entityType: varchar("entity_type"),
  result: varchar("result").notNull(),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }),
  matchDetails: jsonb("match_details"),
  checkedBy: varchar("checked_by"),
  checkedAt: timestamp("checked_at").defaultNow(),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee Schedule
export const feeSchedule = pgTable("fee_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productType: varchar("product_type").notNull(),
  feeName: varchar("fee_name").notNull(),
  feeType: varchar("fee_type").notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }),
  percentage: decimal("percentage", { precision: 8, scale: 4 }),
  minAmount: decimal("min_amount", { precision: 18, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 18, scale: 2 }),
  currency: varchar("currency").default("NGN"),
  isActive: boolean("is_active").default(true),
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transaction Fees
export const transactionFees = pgTable("transaction_fees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  feeScheduleId: varchar("fee_schedule_id"),
  feeName: varchar("fee_name").notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("NGN"),
  status: varchar("status").default("pending"),
  debitedAt: timestamp("debited_at"),
  debitReference: varchar("debit_reference"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFormMSchema = createInsertSchema(formM).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFormASchema = createInsertSchema(formA).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaarSchema = createInsertSchema(paar).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFormNxpSchema = createInsertSchema(formNxp).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBfcSchema = createInsertSchema(billsForCollection).omit({ id: true, createdAt: true, updatedAt: true });
export const insertImportLcSchema = createInsertSchema(importLc).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFxTradeSchema = createInsertSchema(fxTrades).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTradeLoanSchema = createInsertSchema(tradeLoans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInwardPaymentSchema = createInsertSchema(inwardPayments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDomOutwardSchema = createInsertSchema(domOutwardPayments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertShippingDocSchema = createInsertSchema(shippingDocuments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type FormM = typeof formM.$inferSelect;
export type InsertFormM = z.infer<typeof insertFormMSchema>;
export type FormA = typeof formA.$inferSelect;
export type InsertFormA = z.infer<typeof insertFormASchema>;
export type Paar = typeof paar.$inferSelect;
export type InsertPaar = z.infer<typeof insertPaarSchema>;
export type FormNxp = typeof formNxp.$inferSelect;
export type InsertFormNxp = z.infer<typeof insertFormNxpSchema>;
export type BillForCollection = typeof billsForCollection.$inferSelect;
export type InsertBfc = z.infer<typeof insertBfcSchema>;
export type ImportLc = typeof importLc.$inferSelect;
export type InsertImportLc = z.infer<typeof insertImportLcSchema>;
export type FxTrade = typeof fxTrades.$inferSelect;
export type InsertFxTrade = z.infer<typeof insertFxTradeSchema>;
export type TradeLoan = typeof tradeLoans.$inferSelect;
export type InsertTradeLoan = z.infer<typeof insertTradeLoanSchema>;
export type InwardPayment = typeof inwardPayments.$inferSelect;
export type InsertInwardPayment = z.infer<typeof insertInwardPaymentSchema>;
export type DomOutwardPayment = typeof domOutwardPayments.$inferSelect;
export type InsertDomOutward = z.infer<typeof insertDomOutwardSchema>;
export type ShippingDocument = typeof shippingDocuments.$inferSelect;
export type InsertShippingDoc = z.infer<typeof insertShippingDocSchema>;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type SwiftMessage = typeof swiftMessages.$inferSelect;
export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type FeeSchedule = typeof feeSchedule.$inferSelect;
export type TransactionFee = typeof transactionFees.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
