import React from "react";
import Select from "react-select";
import styles from "./styles/selectGenre.module.css";

const bankOptions = [
  { value: "Femenino", label: "Femenino" },
  { value: "Masculino", label: "Masculino" },
];

function SelectGenre({ select }: { select: (option: string) => void }) {
  const handleChange = (selectedOption: any) => {
    select(selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <Select
        className={styles.inputGenre}
        placeholder={"Selecciona tu Genero"}
        options={bankOptions}
        onChange={handleChange}
      />
    </>
  );
}

export default SelectGenre;
