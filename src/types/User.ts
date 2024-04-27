import { Status } from "@prisma/client";

export type ScalarUser = {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar: string | undefined | null;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
  Document: Document[]; // Agregado según tu esquema
  LoanApplication: ScalarLoanApplication[]; // Agregado según tu esquema
};

// Tipo para LoanApplication
export type ScalarLoanApplication = {
  id?: string;
  userId: string;
  bankCurrentAccount: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  entity: string;
  fundsOrigin: string;
  ccNumber: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScalarPdfLoan = {
  id?: string;
  loanApplicationId: string;
  headerTitle: string;
  firstExplainText: string;
  secondTitle: string;
  optionAccount: Record<string, any>[];
  threeTitle: string;
  justifyText: string;
  justifyUser: string;
  numberOnce: string;
  textOnce: string;
  finalTitle: string;
  subFinalText: string;
  finalText: string;
};

// Tipo para Document
export type ScalarDocument = {
  id: string;
  userId: string;
  documentFront: string | undefined;
  documentBack: string | undefined;
  number: string;
  createdAt: Date;
  updatedAt: Date;
};

// // Enum para Estado
// export type Status =
//   | "PENDIENTE"
//   | "APROBADO"
//   | "RECHAZADO"
//   | "PAGADO"
//   | "VENCIDO"
//   | "EN_MORA"
//   | "EN_PROCESO_DE_COBRO"
//   | "EN_NEGOCIACIÓN";
