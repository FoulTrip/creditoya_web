"use client"

import React, { useState } from "react";
import { TbCopy, TbCheck } from "react-icons/tb";
import styles from "./styles/copy.module.css";

function CopyText({ text, copy }: { text: string; copy: boolean }) {
  const [copyText, setCopy] = useState<boolean>(false);

  const handleCopyText = () => {};
  return (
    <div className={styles.btnCopyText}>
      <p className={styles.TextBtn}>{text}</p>
      {copy && (
        <div className={styles.boxIconCopy}>
          <TbCopy onClick={handleCopyText} />
        </div>
      )}
    </div>
  );
}

export default CopyText;
