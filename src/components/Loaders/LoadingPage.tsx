import React from "react";
import styles from "./loading_page.module.css";
import { TbLoader2 } from "react-icons/tb";

function LoadingPage() {
  return (
    <>
      <main className={styles.MainLoader}>
        <div className={styles.centerMainLoader}>
          <div className={styles.boxIconLoader}>
            <TbLoader2 className={styles.iconLoader} size={30} />
          </div>
          <h3 className={styles.textLoader}>Cargando</h3>
        </div>
      </main>
    </>
  );
}

export default LoadingPage;
