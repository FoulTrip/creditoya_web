// ContractForm.jsx
import React from "react";
import BarParts from "./BarParts";
import CommonInputFieldsList from "./CommonInputFieldsList";
import { ScalarLoanApplication } from "@/types/User";

const ContractForm = ({
  formData,
  handleInputChange,
  keysLoan,
  openPart,
  setOpenPart,
  completeInputs,
}: {
  formData: ScalarLoanApplication;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof ScalarLoanApplication
  ) => void;
  keysLoan: (keyof ScalarLoanApplication)[];
  openPart: boolean;
  setOpenPart: React.Dispatch<React.SetStateAction<boolean>>;
  completeInputs: () => boolean;
}) => {
  const fields: (keyof ScalarLoanApplication)[] = formData
    ? (Object.keys(formData) as (keyof ScalarLoanApplication)[])
    : [];

  return (
    <>
      <BarParts
        titleBar={"Informacion del credito"}
        openBar={() => setOpenPart(!openPart)}
        openBarStatus={openPart}
        inputsComplete={completeInputs()}
      />
      {openPart && (
        <CommonInputFieldsList
          fields={fields}
          formData={formData}
          handleInputChange={handleInputChange}
          keysLoan={keysLoan}
        />
      )}
    </>
  );
};

export default ContractForm;
