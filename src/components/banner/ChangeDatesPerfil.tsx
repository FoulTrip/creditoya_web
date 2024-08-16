import React from "react";
import styles from "./changes.module.css";
import { TbInfoCircle, TbX } from "react-icons/tb";
import { useRouter } from "next/navigation";

interface ChangeDates {
  userId: string;
  onClose: () => void;
}

function ChangeDatesPerfil({ userId, onClose }: ChangeDates) {
  const router = useRouter();
  return (
    <div className={styles.containerBanner}>
      <div className={styles.boxMessage}>
        <div className={styles.centerBoxMessage}>
          <div className={styles.boxIconInfo}>
            <TbInfoCircle size={20} className={styles.iconInfo} />
          </div>
          <p className={styles.message}>
            Revisa y valida tu información antes de solicitar otro prestamo.
          </p>
        </div>
      </div>
      <div className={styles.boxGo}>
        <div
          className={styles.btnVerifyGo}
          onClick={() => router.push(`/profile/${userId}`)}
        >
          <p>Verificar</p>
        </div>
        <div className={styles.bocIconX}>
          <TbX size={20} className={styles.iconX} onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

export default ChangeDatesPerfil;
