import React from "react";
import styles from "../Contract.module.css";
import { TbInfoCircle } from "react-icons/tb";

const CommonInputField = ({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string | undefined;
}) => {
  return (
    <div className={styles.boxInput}>
      <div className={styles.headerInputInfo}>
        <p>{label}</p>
        <div className={styles.infoInput}>
          <p className={styles.infoText}>
            {value ? "Obligatorio" : "Opcional"}
          </p>
          <div className={styles.boxIconInfo}>
            <TbInfoCircle size={20} />
          </div>
        </div>
      </div>
      <input
        className={styles.inputInfo}
        type="text"
        value={value || ""}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default CommonInputField;
