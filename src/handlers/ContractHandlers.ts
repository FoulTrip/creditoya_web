import { ScalarLoanApplication } from "@/types/User";

// Función para convertir el valor de formData[field] al tipo adecuado
const getFieldValue = (value: any): string | number => {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  } else if (value instanceof Date) {
    return value.toISOString();
  } else {
    return value.toString();
  }
};

export const sectionInputs = ({
  key,
  formData,
}: {
  key: (keyof ScalarLoanApplication)[];
  formData: ScalarLoanApplication;
}) => {
  for (const field of key) {
    if (
      !formData ||
      formData[field] === undefined ||
      (typeof formData[field] !== "string" &&
        typeof formData[field] !== "number" &&
        typeof formData[field] !== "undefined") ||
      (typeof formData[field] === "string" &&
        formData[field] !== undefined &&
        (formData[field] as string).trim() === "")
    ) {
      return false;
    }
  }

  return true;
};

export const isRequired = (key: keyof ScalarLoanApplication) => {
  const optionalFields: (keyof ScalarLoanApplication)[] = [
    "id",
    "affecting_loan_balance",
    "affecting_loan_entity_name",
    "affecting_loan_quota_value",
    "affiliated_company",
    "amount_in_the_other_entity",
    "average_variable_salary",
    "bankCurrentAccount",
    "bankNumberAccount",
    "bankSavingAccount",
    "birthDate",
    "ccNumber",
    "cellPhone",
    "city",
    "co_debtor",
    "codebtor_in_creditoya",
    "codebtor_origin_creditoya",
    "commercial_value",
    "complete_name_spouse",
    "contract_termination_date",
    "court",
    "current_loans_affecting",
    "date_relationship",
    "firtLastName",
    "family_members_in_company_agreement",
    "family_reference_address",
    "family_reference_city",
    "family_reference_name",
    "family_reference_number_phone",
    "family_reference_work_company_name",
    "genre",
    "housing_type",
    "indefinite_term",
    "is_currently_codebtor",
    "labor_or_work",
    "labor_seniority",
    "labor_seniority_contracts",
    "marital_status",
    "monthly_income",
    "monthly_discounts",
    "names",
    "number_document_spouse",
    "number_employees",
    "other_entity",
    "other_income_other_principal",
    "other_personal_commercial_value",
    "patrimony",
    "phone_company_spoue",
    "phone_spouse",
    "place_birth",
    "pignorado",
    "remarks",
    "residence_address",
    "residence_phone",
    "status",
    "terms_and_conditions",
    "total_assets",
    "total_liabilities",
    "total_monthly_income",
    "updatedAt",
    "userId",
    "vehicle",
    "vehicleType",
    "whatsapp_number",
  ];

  return !optionalFields.includes(key);
};

export default getFieldValue;
