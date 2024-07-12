"use client";

import React, { useState } from "react";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import styles from "./styles/copy.module.css";

function CopyText({
  text,
  copy,
  p,
  h5,
}: {
  text: string;
  copy: boolean;
  p?: boolean;
  h5?: boolean;
}) {
  const [copyText, setCopy] = useState<boolean>(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopy(true);
      setTimeout(() => setCopy(false), 2000);
    } catch (error) {
      console.error("Error copying text: ", error);
    }
  };

  return (
    <div className={styles.btnCopyText}>
      {p && <p className={styles.TextBtn}>{text}</p>}
      {h5 && <h5 className={styles.TextBtn}>{text}</h5>}
      {!h5 && !p && <p className={styles.TextBtn}>{text}</p>}
      {copy && (
        <div className={styles.boxIconCopy}>
          {copyText && <TbCopyCheck className={styles.iconCheck} size={20} />}
          {!copyText && (
            <TbCopy
              className={styles.iconCheck}
              onClick={handleCopyText}
              size={20}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CopyText;
