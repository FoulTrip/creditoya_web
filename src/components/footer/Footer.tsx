import React from "react";
import styles from "./footer.module.css";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function IntFooter() {
  return (
    <>
      <footer className={styles.footer}>
        <p className={styles.textCopy}>
          &copy; 2024 Credito Ya, Todos los derechos reservados.
        </p>
        <div className={styles.centerBoxPart}>
          <div className={styles.partRedes}>
            <div className={styles.boxIconRed}>
              <FaFacebook className={styles.iconRed} size={25} />
            </div>
            <div className={styles.boxIconRed}>
              <FaInstagram className={styles.iconRed} size={25} />
            </div>
            <div className={styles.boxIconRed}>
              <FaXTwitter className={styles.iconRed} size={25} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default IntFooter;
