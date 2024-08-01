"use client";

import React from "react";
import styles from "./styles/Service.module.css";
import Image from "next/image";

import iconSchoolLoan from "@/assets/LearningIcon.svg";
import iconDeath from "@/assets/iconFamilyDeath.svg";
import iconRevenue from "@/assets/Revenue-bro.svg";
import iconBuild from "@/assets/Bricklayer-bro.svg";
import iconSoldier from "@/assets/Manage money-bro.svg";
import iconSeller from "@/assets/Shops re-opening soon-bro.svg";
import iconvehicle from "@/assets/Motocross-bro.svg";
import iconMedical from "@/assets/Medical research-bro.svg";
import { useRouter } from "next/navigation";

function ServiceSection() {
  const router = useRouter();

  return (
    <>
      <div className={styles.mainService}>
        <div className={styles.headerMainServices}>
          <h1 className={styles.titleService}>
            Soluciones Financieras a Tu Alcance
          </h1>
          <p>
            Préstamos Rápidos y Flexibles para Impulsar Tus Metas Financieras
          </p>
        </div>
        <div className={styles.listServices}>
          <div
            className={styles.cardService}
            onClick={() => router.push("/docs/planes/creditos_educativos")}
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconSchoolLoan}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>Créditos Educativos</h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push("/docs/planes/credito_vivienda_ahorro_programado")
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconRevenue}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito Vivienda Ahorro Programado
              </h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push(
                "/docs/planes/credito_vivienda_adquisicion_o_reparaciones_locativas"
              )
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconBuild}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito Vivienda Adecuación - Reparaciones Locativas
              </h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push("/docs/planes/libre_inversion_y_consumo")
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconSoldier}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Libre Inversión y/o Consumo.
              </h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push("/docs/planes/credito_apoyo_actividades_lucrativas")
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconSeller}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito Apoyo actividades lucrativas
              </h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() => router.push("/docs/planes/credito_transporte")}
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconvehicle}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>Crédito Transporte</h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push("/docs/planes/credito_para_complemento_en_salud")
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconMedical}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito para complemento en Salud
              </h3>
            </div>
          </div>

          <div
            className={styles.cardService}
            onClick={() =>
              router.push(
                "/docs/planes/credito_para_complemento_familiar_o_financiera"
              )
            }
          >
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconDeath}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito para complemento funerarios a familiares
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceSection;
