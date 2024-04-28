import React, { useState } from "react";
import styles from "./styles/HeroinSection.module.css";
import Image from "next/image";
import ImageGif from "@/assets/ilustrationHeroinSection.png";
import {
  TbArrowNarrowRight,
  TbCircleCheckFilled,
  TbClockBolt,
  TbCreditCardRefund,
  TbShieldCheck,
} from "react-icons/tb";
import { useRouter } from "next/navigation";

function HeroinSection() {
  const [text01, setText01] = useState<boolean>(false);
  const [text02, setText02] = useState<boolean>(false);
  const [text03, setText03] = useState<boolean>(false);
  const [text04, setText04] = useState<boolean>(false);

  const router = useRouter();

  return (
    <>
      <main className={styles.ContainerMain}>
        <div className={styles.ilustrationContent}>
          <Image className={styles.ilustrationGif} src={ImageGif} alt="myGif" />
        </div>
        <div className={styles.Boxtexts}>
          <div className={styles.centerBoxTexts}>
            <h2 className={styles.title}>
              Crédito Digital, Fácil y Veloz con
              <span className={styles.nameWeb}> Credito Ya</span>
            </h2>
            <div className={styles.cardTestLoan}>
              <div className={styles.centerCardTestLoan}>
                <div className={styles.boxReq}>
                  <input
                    className={styles.inputReq}
                    type="text"
                    placeholder="Ingresa tu correo electronico"
                    onChange={(e) => {
                      e.target.value.length > 0 && setText01(true);
                      e.target.value.length == 0 && setText01(false);
                    }}
                  />
                  <div className={styles.boxIcon}>
                    <TbCircleCheckFilled
                      className={
                        text01 ? styles.iconCheckActive : styles.iconCheck
                      }
                      size={20}
                    />
                  </div>
                </div>

                <div className={styles.boxReq}>
                  <input
                    className={styles.inputReq}
                    type="text"
                    placeholder="Monto de dinero"
                    onChange={(e) => {
                      e.target.value.length > 0 && setText02(true);
                      e.target.value.length == 0 && setText02(false);
                    }}
                  />
                  <div className={styles.boxIcon}>
                    <TbCircleCheckFilled
                      className={
                        text02 ? styles.iconCheckActive : styles.iconCheck
                      }
                      size={20}
                    />
                  </div>
                </div>

                <div className={styles.boxReq}>
                  <input
                    className={styles.inputReq}
                    type="text"
                    placeholder="Numero telefonico"
                    onChange={(e) => {
                      e.target.value.length > 0 && setText03(true);
                      e.target.value.length == 0 && setText03(false);
                    }}
                  />
                  <div className={styles.boxIcon}>
                    <TbCircleCheckFilled
                      className={
                        text03 ? styles.iconCheckActive : styles.iconCheck
                      }
                      size={20}
                    />
                  </div>
                </div>

                <div className={styles.boxReq}>
                  <input
                    className={styles.inputReq}
                    type="text"
                    placeholder="Numero de documento"
                    onChange={(e) => {
                      e.target.value.length > 0 && setText04(true);
                      e.target.value.length == 0 && setText04(false);
                    }}
                  />
                  <div className={styles.boxIcon}>
                    <TbCircleCheckFilled
                      className={
                        text04 ? styles.iconCheckActive : styles.iconCheck
                      }
                      size={20}
                    />
                  </div>
                </div>

                <button
                  className={styles.btnGetStarted}
                  onClick={() => router.push("/dashboard")}
                >
                  <div className={styles.centerBtn}>
                    <p className={styles.textBtn}>Empieza ahora</p>
                    <div className={styles.boxIconBtn}>
                      <TbArrowNarrowRight
                        className={styles.iconBtn}
                        size={22}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className={styles.failures}>
              <div className={styles.boxFailure}>
                <div className={styles.boxIconFailure}>
                  <TbShieldCheck size={25}  />
                </div>
                <p>100% Seguro y legal</p>
              </div>

              <div className={styles.boxFailure}>
                <div className={styles.boxIconFailure}>
                  <TbClockBolt size={25} className={styles.iconFailure} />
                </div>
                <p>3-2 minutos de proceso</p>
              </div>

              <div className={styles.boxFailure}>
                <div className={styles.boxIconFailure}>
                  <TbCreditCardRefund
                    className={styles.iconFailure}
                    size={25}
                  />
                </div>
                <p>fondos al siguiente día hábil</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default HeroinSection;
