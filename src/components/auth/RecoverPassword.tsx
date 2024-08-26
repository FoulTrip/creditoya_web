import React, { useState } from "react";
import styles from "./auth.module.css";
import { TbLoader, TbMail } from "react-icons/tb";

function RecoverPassword({ onCancel }: { onCancel: () => void }) {
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [emailRecover, setEmailRecover] = useState<string | null>(null);

  const handleChangelPass = () => {
    setLoadingVerify(true);
  };

  return (
    <>
      <div className={styles.cancelBtn} onClick={onCancel}>
        <p>Cancelar</p>
      </div>
      <h5 className={styles.warnText}>
        Ingresa tu correo electronico con el que te registraste
      </h5>
      <div className={styles.boxInput}>
        <div className={styles.subBoxIconInput}>
          <TbMail className={styles.iconInput} size={20} />
        </div>
        <input
          className={styles.input}
          type="text"
          name="email"
          placeholder="Correo Electronico"
          onChange={(e) => setEmailRecover(e.target.value)}
          //   value={formData.email}
        />
      </div>

      <div className={styles.bntSubPass}>
        {!loadingVerify && (
          <button onClick={handleChangelPass}>Solicitar</button>
        )}
        {loadingVerify && (
          <>
            <div className={styles.containerLoader}>
              <div className={styles.bocCenterLoader}>
                <div className={styles.boxIconLoader}>
                  <TbLoader className={styles.iconLoader} />
                </div>
                <p className={styles.textLoader}>Comprobando Identidad</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RecoverPassword;
