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
  LoanApplication: LoanApplication[]; // Agregado según tu esquema
};

// Tipo para LoanApplication
export type LoanApplication = {
  id?: string;
  userId: string;
  bankCurrentAccount: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  entity: string;
  fundsOrigin: string;
  signature: string;
  ccNumber: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
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

// Enum para Status
export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
