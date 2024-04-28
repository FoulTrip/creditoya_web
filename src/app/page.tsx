"use client";

import styles from "./page.module.css";
import { useGlobalContext } from "@/context/Auth";

export default function Home() {
  const { user } = useGlobalContext();
  return (
    <>
      <main className={styles.ContainerMain}>Hola</main>
    </>
  );
}
