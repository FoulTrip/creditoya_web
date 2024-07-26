import React from "react";
import styles from "./styles/instructions.module.css";
import DocsRequires from "../instructions/DocsRequires";
import FormRequest from "../instructions/FormReq";

function Instructions({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className={styles.headerInstructions}>
        <h1>Creacion de una solicitud de prestamo</h1>
        <div className={styles.boxCancelBtn} onClick={onClose}>
          <p>Cancelar</p>
        </div>
      </div>

      <DocsRequires />
      <FormRequest />
    </>
  );
}

export default Instructions;
