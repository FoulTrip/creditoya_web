import React from "react";
import Select from "react-select";
import styles from "./styles/selectGenre.module.css";
import { companiesUser } from "@/types/User";

const bankOptions = [
  { value: "incauca_sas", label: "Incauca S.A.S" },
  { value: "incauca_cosecha", label: "Incauca Cosecha" },
  { value: "providencia_sas", label: "Providencia S.A" },
  { value: "providencia_cosecha", label: "Providencia Cosecha" },
  { value: "con_alta", label: "Con Alta" },
  { value: "pichichi_sas", label: "pichichi S.A.S" },
  { value: "pichichi_coorte", label: "pichichi Coorte" },
  { value: "valor_agregado", label: "Valor agregado" },
  { value: "no", label: "Ninguno de las anteriores" },
];

function SelectCompanies({
  select,
  valueDefault,
}: {
  select: (option: companiesUser) => void;
  valueDefault: string;
}) {
  const defaultOption =
    bankOptions.find((option) => option.value === valueDefault) || null;
  const handleChange = (selectedOption: any) => {
    select(selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <Select
        className={styles.inputGenre}
        options={bankOptions}
        onChange={handleChange}
        placeholder={"Selecciona tu empresa"}
        value={defaultOption}
      />
    </>
  );
}

export default SelectCompanies;
