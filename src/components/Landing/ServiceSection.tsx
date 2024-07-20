import React from "react";
import styles from "./styles/Service.module.css";
import Image from "next/image";

import iconSchoolLoan from "@/assets/LearningIcon.svg";
import iconRevenue from "@/assets/Revenue-bro.svg";
import iconBuild from "@/assets/Bricklayer-bro.svg";
import iconSoldier from "@/assets/Manage money-bro.svg";
import iconSeller from "@/assets/Shops re-opening soon-bro.svg";
import iconvehicle from "@/assets/Motocross-bro.svg";

function ServiceSection() {
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
          <div className={styles.cardService}>
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

          <div className={styles.cardService}>
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

          <div className={styles.cardService}>
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

          <div className={styles.cardService}>
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconSoldier}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>Libre inversion</h3>
            </div>
          </div>

          <div className={styles.cardService}>
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

          <div className={styles.cardService}>
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

          <div className={styles.cardService}>
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconSchoolLoan}
                  alt={"schoolLoan"}
                />
              </div>
              <h3 className={styles.subTitleService}>
                Crédito para complemento en Salud
              </h3>
            </div>
          </div>

          <div className={styles.cardService}>
            <div className={styles.centerCardService}>
              <div className={styles.boxIconService}>
                <Image
                  className={styles.iconService}
                  src={iconRevenue}
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
