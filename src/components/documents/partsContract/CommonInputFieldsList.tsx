import React from "react";
import CommonInputField from "./CommonInputField";
import { ScalarLoanApplication } from "@/types/User";
import styles from "../Contract.module.css";
import getFieldValue from "@/handlers/getFieldValue";

interface PropsInputField {
  fields: (keyof ScalarLoanApplication)[];
  formData: ScalarLoanApplication;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof ScalarLoanApplication
  ) => void;
  keysLoan: (keyof ScalarLoanApplication)[];
}

const CommonInputFieldsList: React.FC<PropsInputField> = ({
  fields,
  formData,
  handleInputChange,
  keysLoan,
}) => {
  return (
    <div className={styles.containerInputs}>
      {fields.map((field: keyof ScalarLoanApplication, index: number) => (
        <CommonInputField
          key={index}
          label={field}
          value={getFieldValue(formData[field]) || ""}
          onChange={(e) =>
            handleInputChange(e, field as keyof ScalarLoanApplication)
          }
          name={keysLoan.find((key: string) => key === field) as string}
        />
      ))}
    </div>
  );
};

export default CommonInputFieldsList;
