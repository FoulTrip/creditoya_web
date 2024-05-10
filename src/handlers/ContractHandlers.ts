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
        typeof formData[field] !== "number") ||
      (typeof formData[field] === "string" &&
        (formData[field] as string).trim() === "")
    ) {
      return false;
    }
  }

  return true;
};

export default getFieldValue;
