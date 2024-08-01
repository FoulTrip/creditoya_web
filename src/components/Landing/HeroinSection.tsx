"use client";

import React from "react";
import styles from "./styles/HeroinSection.module.css";
import Image from "next/image";
import ImageGif from "@/assets/Farmer-bro.svg";
import logoApp from "@/assets/creditoya_logo.png";

import { TbArrowNarrowRight } from "react-icons/tb";
import { useRouter } from "next/navigation";

function HeroinSection() {
  const router = useRouter();

  return (
    <>
      <main className={styles.supraMain}>
        {/* <div className={styles.centerMain}> */}
        <div className={styles.infoContent}>
          <div className={styles.centerInfoContent}>
            <div className={styles.boxLogoMinimalist}>
              <Image
                src={logoApp}
                className={styles.secondIlus}
                alt="logoApp"
              />
            </div>
            <p className={styles.slogan}>
              Facilitando el crecimiento de los trabajadores agrícolas con
              créditos oportunos y servicios de deuda acorde a sus ingresos.
              Construyendo confianza y apoyando su desarrollo familiar y social.
            </p>
            <div
              className={styles.btn}
              onClick={() => router.push("/dashboard")}
            >
              <div className={styles.centerBtn}>
                <p>Solicitar Prestamo</p>
                <div className={styles.boxIconArrow}>
                  <TbArrowNarrowRight className={styles.iconArrow} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ilustrationContent}>
          <Image className={styles.ilustrationGif} src={ImageGif} alt="myGif" />
        </div>
        {/* </div> */}
      </main>
    </>
  );
}

export default HeroinSection;
