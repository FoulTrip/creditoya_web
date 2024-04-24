"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Auth";

export default function Home() {
  const { user } = useGlobalContext()
  console.log(user);
  return (
    <>
      <main className={styles.ContainerMain}>Hola</main>
    </>
  );
}
