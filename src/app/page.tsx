"use client";

import HeroinSection from "@/components/Landing/HeroinSection";
import styles from "./page.module.css";
import { useGlobalContext } from "@/context/Auth";

export default function Home() {
  const { user } = useGlobalContext();
  return (
    <>
      <HeroinSection />
    </>
  );
}
