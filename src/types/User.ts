export type ScalarUser = {
  id?: string;
  password: string;
  email: string;
  names: string;
  firstLastName: string;
  secondLastName: string;
  currentCompanie?: companiesUser;
  avatar?: string;
  phone?: string;
  residence_phone_number?: string;
  phone_whatsapp?: string;
  birth_day?: Date;
  place_of_birth?: string;
  genre?: GenreUser;
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
  id?: string;
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
  genre?: GenreUser;
  residence_address?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token: string;
  currentCompanie: companiesUser;
};

// Tipo para LoanApplication
export type ScalarLoanApplication = {
  id?: string;
  userId: string;
  employeeId?: string;
  fisrt_flyer?: string;
  upid_first_flayer?: string;
  second_flyer?: string;
  upid_second_flyer?: string;
  third_flyer?: string;
  upid_third_flayer?: string;
  signature: string;
  upSignatureId: string;
  cantity: string;
  status: Status;
  reasonReject?: string;
  reasonChangeCantity?: string;
  newCantity?: string;
  newCantityOpt?: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  labor_card?: string;
  upid_labor_card?: string;
  entity: string;
  terms_and_conditions: boolean;
  created_at: Date;
  updated_at: Date;
};

// Tipo para Document
export type ScalarDocument = {
  id: string;
  userId: string;
  typeDocument: TypesDocument;
  documentSides: string;
  imageWithCC: string | undefined;
  number: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  upId: string;
};

export type Status =
  | "Pendiente"
  | "Aprobado"
  | "Aplazado"
  | "Borrador"
  | "Archivado";

export type TypesDocument = "CC" | "CE" | "PASAPORTE";

export type GenreUser = "Femenino" | "Masculino" | "No";

export type companiesUser =
  | "incauca_sas"
  | "incauca_cosecha"
  | "providencia_sas"
  | "providencia_cosecha"
  | "con_alta"
  | "pichichi_sas"
  | "pichichi_coorte"
  | "valor_agregado"
  | "no";
