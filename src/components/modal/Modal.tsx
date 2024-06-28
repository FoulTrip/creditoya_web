"use client";

import React, { ReactNode, Dispatch, SetStateAction } from "react";
import styles from "./modal.module.css";
import { link } from "fs";

interface modalProps {
  isOpen: boolean;
  link: string | null;
  onClose: () => void;
  children: ReactNode | null;
}

const Modal = ({ isOpen, onClose, children, link }: modalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {!link ? children : null}

        {link && (
          <object
            data={link}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}

        <button className={styles.close_button} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
