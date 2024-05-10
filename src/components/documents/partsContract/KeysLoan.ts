import { ScalarLoanApplication } from "@/types/User";

// Aqui se agregan todas las keys existentes
export const keysLoan: (keyof ScalarLoanApplication)[] = Object.keys(
  {} as ScalarLoanApplication
) as (keyof ScalarLoanApplication)[];

export const keysLoan01: (keyof ScalarLoanApplication)[] = [
  "principal_debtor",
  "co_debtor",
  "affiliated_company",
  "nit",
  "requested_amount",
  "deadline",
  "payment",
  "quota_value",
];

export const keysLoan02: (keyof ScalarLoanApplication)[] = [
  "firtLastName",
  "secondLastName",
  "names",
  "occupation",
  "typeDocument",
  "numberDocument",
  "persons_in_charge",
  "birthDate",
  "place_birth",
  "genre",
  "marital_status",
  "cellPhone",
  "destination_resources",
  "labor_seniority",
  "residence_address",
  "city",
  "residence_phone",
  "housing_type",
  "email",
  "vehicle",
  "vehicleType",
  "whatsapp_number",
  "pignorado",
  "in_favor_pignorado",
  "is_currently_codebtor",
  "commercial_value",
  "other_personal_commercial_value",
  "family_members_in_company_agreement",
  "is_currently_codebtor",
  "codebtor_in_creditoya",
  "codebtor_origin_creditoya",
  "other_entity",
  "codebtor_origin_creditoya",
  "amount_in_the_other_entity",
  "complete_name_spouse",
  "number_document_spouse",
  "phone_spouse",
  "phone_company_spoue",
];

export const keysLoan03: (keyof ScalarLoanApplication)[] = [
  "monthly_income",
  "monthly_expenses",
  "total_assets",
  "total_liabilities",
  "patrimony",
  "quota_value",
  "court",
  "number_employees",
  "other_income_other_principal",
  "which_other_income",
  "monthly_income",
];

export const keysLoan04: (keyof ScalarLoanApplication)[] = [
  "personal_reference_name",
  "personal_reference_work_company_name",
  "personal_reference_city",
  "personal_reference_address",
  "personal_reference_number_residence",
  "personal_reference_number_phone",
  "family_reference_name",
  "family_reference_work_company_name",
  "family_reference_city",
  "family_reference_address",
  "family_reference_number_residence",
  "family_reference_number_phone",
];

export const keysLoan05: (keyof ScalarLoanApplication)[] = [
  "fixed_term",
  "labor_or_work",
];

export const keysLoan06: (keyof ScalarLoanApplication)[] = [
  "date_relationship",
  "labor_seniority_contracts",
  "requested_amount",
  "average_variable_salary",
  "total_monthly_income",
  "monthly_discounts",
];
