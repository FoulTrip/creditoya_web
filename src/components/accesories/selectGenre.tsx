import React from "react";
import Select from "react-select";
import styles from "./styles/selectGenre.module.css";

const bankOptions = [
  { value: "Femenino", label: "Femenino" },
  { value: "Masculino", label: "Masculino" },
];

function SelectGenre({
  select,
  valueDefault,
}: {
  select: (option: string) => void;
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
        value={defaultOption}
      />
    </>
  );
}

export default SelectGenre;
