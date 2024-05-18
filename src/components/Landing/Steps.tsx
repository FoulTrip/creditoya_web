import React from "react";
import styles from "./styles/StepSection.module.css";
import Image from "next/image";

import imgService01 from "@/assets/imageService01.svg";
import imgService02 from "@/assets/imageService02.svg";
import imgService03 from "@/assets/Online document-bro.svg";

function StepSection() {
  return (
    <>
      <main className={styles.mainServices}>
        <div>
          <h1 className={styles.TitleServices}>
            ¡Solicita tu credito en menos de 30 minutos!
          </h1>
          <p className={styles.viewText}>Observa como lo puedes lograr</p>
        </div>

        <div className={styles.serviceBox}>
          <div className={styles.centerServiceBox}>
            <div className={styles.ilustrationService}>
              <Image
                src={imgService02}
                className={styles.ilusIcon}
                alt="service01"
              />
            </div>
            <div className={styles.infoService}>
              <div className={styles.centerInfoService}>
                <div className={styles.boxStep}>
                  <p className={styles.step}>1</p>
                </div>
                <h2>Registrate y crea una cuenta en Credito Ya</h2>
                <p>
                  Usa tu correo electrónico y una contraseña que puedas recordar
                  para crear tu propia cuenta en nuestra aplicación. Con esta
                  cuenta, podrás pedir préstamos fácilmente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.serviceBoxRb}>
          <div className={styles.centerServiceBox}>
            <div className={styles.infoService}>
              <div className={styles.centerInfoServiceDob}>
                <div className={styles.boxStepDob}>
                  <p className={styles.step}>2</p>
                </div>
                <h2>Documentos requeridos</h2>
                <p>
                  Después de crear tu cuenta, necesitamos que subas fotos claras
                  de tus documentos. Esto nos ayuda a verificar tu identidad y
                  mantener segura tu cuenta y tus préstamos.
                </p>
              </div>
            </div>

            <div className={styles.ilustrationService}>
              <Image
                src={imgService01}
                className={styles.ilusIcon}
                alt="service01"
              />
            </div>
          </div>
        </div>

        <div className={styles.serviceBox}>
          <div className={styles.centerServiceBox}>
            <div className={styles.ilustrationService}>
              <Image
                src={imgService03}
                className={styles.ilusIcon}
                alt="service01"
              />
            </div>
            <div className={styles.infoService}>
              <div className={styles.centerInfoService}>
                <div className={styles.boxStep}>
                  <p className={styles.step}>1</p>
                </div>
                <h2>Solicita tu prestamo</h2>
                <p>
                  Una vez completes los datos de tu perfil puedes comenzar a
                  solicitar tus prestamos llenando un simple formulario y lo
                  mejor de todo esperando la aprobacion de nuesto equipo de
                  trabajo en poco tiempo y en tiempo real desde tu panel
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default StepSection;
