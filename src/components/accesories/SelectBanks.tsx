import React from "react";
import Select from "react-select";
import styles from "./styles/select.module.css";

const bankOptions = [
  { value: "bancolombia", label: "Bancolombia" },
  { value: "banco-bogota", label: "Banco de Bogotá" },
  { value: "davivienda", label: "Davivienda" },
  { value: "bbva", label: "BBVA Colombia" },
  { value: "av-villas", label: "Banco AV Villas" },
  { value: "banco-popular", label: "Banco Popular" },
  { value: "colpatria", label: "Banco Colpatria" },
  { value: "banco-caja-social", label: "Banco Caja Social" },
  { value: "itau", label: "Banco Itaú" },
  { value: "scotiabank-colpatria", label: "Scotiabank Colpatria" },
  { value: "citibank", label: "Citibank Colombia" },
  { value: "gnb-sudameris", label: "GNB Sudameris" },
  { value: "bancoomeva", label: "Bancoomeva" },
  { value: "banco-pichincha", label: "Banco Pichincha" },
  { value: "banco-agrario", label: "Banco Agrario de Colombia" },
  { value: "banco-cooperativo", label: "Banco Cooperativo Coopcentral" },
  { value: "bancamia", label: "Bancamía" },
];

function SelectBanks({ select }: { select: (option: string) => void }) {

  const handleChange = (selectedOption: any) => {
    select(selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <div className={styles.entity}>
        <h5>Entidad bancaria</h5>
        <Select
          placeholder={"Selecciona tu entidad bancaria"}
          className={styles.select}
          id="banks"
          options={bankOptions}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default SelectBanks;
