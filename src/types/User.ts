export type ScalarUser = {
  id?: string;
  password: string;
  email: string;
  names: string;
  firstLastName: string;
  secondLastName: string;
  avatar?: string;
  phone?: string;
  residence_phone_number?: string;
  phone_is_wp?: boolean;
  phone_whatsapp?: string;
  birth_day?: Date;
  place_of_birth?: string;
  genre?: string;
  residence_address?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScalarEmployee = {
  id?: string;
  password: string;
  email: string;
  name?: string;
  lastNames?: string;
  avatar?: string;
  rol?: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type AuthUser = {
  id: string;
  names: string;
  email: string;
  avatar?: string;
  token: string;
};

// Tipo para LoanApplication
export type ScalarLoanApplication = {
  id?: string;
  userId: string;
  employeeId?: string;
  fisrt_flyer: string;
  second_flyer: string;
  third_flyer: string;
  signature: string;
  cantity: string;
  status: Status;
  reasonReject?: string;
  bankCurrentAccount: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  labor_card: string;
  entity: string;
  terms_and_conditions: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  typeDocument: TypesDocument;
  documentFront: string | undefined;
  documentBack: string | undefined;
  imageWithCC: string | undefined;
  laborCardId: string | undefined;
  number: string | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type ScalarLaborCard = {
  id: string;
  userId: string;
  filePart: string;
  order: number;
  createAt: Date;
  updatedAt: Date;
};

export type Status =
  | "Pendiente"
  | "Aprobado"
  | "Rechazado"
  | "Borrador"
  | "Archivado";

export type TypesDocument = "CC" | "CE" | "PASAPORTE";
