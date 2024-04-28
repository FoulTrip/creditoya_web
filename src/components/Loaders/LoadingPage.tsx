import React from "react";
import styles from "./loading_page.module.css";

function LoadingPage() {
  return (
    <>
      <main className={styles.MainLoader}>
        <p>Loading...</p>
      </main>
    </>
  );
}

export default LoadingPage;
