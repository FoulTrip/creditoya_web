import React, { useState } from "react";
import styles from "./styles/editInfo.module.css";

import {
  TbCreditCard,
  TbPencil,
  TbEyeClosed,
  TbEye,
  TbBuildingBank,
  TbCreditCardRefund,
} from "react-icons/tb";

function EditInfo({ label, text }: { label: string; text: string }) {
  const [iconEye, setIconEye] = useState<boolean>(true);

  const handleOcultText = () => {
    setIconEye(!iconEye);
  };

  return (
    <>
      <div className={styles.containerEditInfo}>
        <div className={styles.infoLabel}>
          <div className={styles.centerInfoLabel}>
            <div className={styles.boxIconLabel}>
              {label == "Entidad" && (
                <TbBuildingBank className={styles.iconDetail} size={18} />
              )}
              {label == "Tipo" && (
                <TbCreditCardRefund className={styles.iconDetail} size={18} />
              )}
              {label == "Cuenta" && (
                <TbCreditCard className={styles.iconDetail} size={18} />
              )}
            </div>
            <p className={styles.textLabel}>{label}</p>
          </div>
          <p>{!iconEye ? text : "**********"}</p>
        </div>
        <div className={styles.optsLabel}>
          <div className={styles.centerOptsLabel}>
            <div className={styles.boxIconLabelOpts}>
              {!iconEye && (
                <TbEyeClosed
                  size={18}
                  className={styles.btnOptSelect}
                  onClick={handleOcultText}
                />
              )}
              {iconEye && (
                <TbEye
                  size={18}
                  className={styles.btnOptSelect}
                  onClick={handleOcultText}
                />
              )}
            </div>
            <div className={styles.boxIconLabelOpts}>
              <TbPencil size={18} className={styles.btnOptSelect} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditInfo;
