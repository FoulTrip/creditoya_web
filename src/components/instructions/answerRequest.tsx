import React, { useState } from "react";
import styles from "./docsRequire.module.css";
import dashboardImage from "@/assets/dashboardCreditoya.png";
import {
  TbCircleChevronDown,
  TbCircleChevronUp,
  TbShield,
  TbCards,
  TbMobiledata,
  TbMailBolt,
} from "react-icons/tb";
import Image from "next/image";

function AnswerRequest() {
  const [openFiles01, setOpenFiles01] = useState<boolean>(false);
  const [openFiles02, setOpenFiles02] = useState<boolean>(false);
  const [openFiles03, setOpenFiles03] = useState<boolean>(false);

  return (
    <>
      <div className={styles.docsRequires}>
        <div className={styles.partDocsRequires}>
          <div className={styles.Index}>
            <div className={styles.boxIndex}>
              <h5 className={styles.circleIndex}>3</h5>
            </div>
            <h2>Espera respuesta en tiempo real</h2>
          </div>
          <p className={styles.textExplain}>
            Después de enviar su solicitud, puede revisar el estado en tiempo
            real desde el panel o dashboard. Si prefiere, puede cerrar el panel;
            recibirá una notificación por correo electrónico con la decisión
            sobre su préstamo. Este sistema le ofrece la opción de estar al
            tanto de inmediato si lo desea, manteniéndolo informado sobre la
            aprobación o rechazo de su solicitud.
          </p>

          <h4 className={styles.titleDetails}>Algunos detalles del proceso</h4>
          <div className={styles.listSupDocs}>
            <div
              onClick={() => setOpenFiles01(!openFiles01)}
              className={styles.fileBox}
            >
              <div className={styles.boxTexts}>
                <div className={styles.boxFileIcon}>
                  <TbMobiledata className={styles.fileIcon} size={35} />
                </div>
                <div className={styles.centerTextFile}>
                  <h5>Proceso de evaluacion</h5>
                  <p>Acceso al Panel</p>
                </div>
              </div>
              <div className={styles.boxOpenIcon}>
                {!openFiles01 && <TbCircleChevronDown size={20} />}
                {openFiles01 && <TbCircleChevronUp size={20} />}
              </div>
            </div>

            {openFiles01 && (
              <>
                <div className={styles.boxExplainFile01}>
                  <h5>Acceso al Panel</h5>
                  <p>
                    Después de enviar su solicitud, inicie sesión en su panel o
                    dashboard de usuario. Este será el lugar principal para
                    monitorear el estado de su solicitud en tiempo real.
                  </p>
                </div>
              </>
            )}

            <div
              onClick={() => setOpenFiles02(!openFiles02)}
              className={styles.fileBox}
            >
              <div className={styles.boxTexts}>
                <div className={styles.boxFileIcon}>
                  <TbCards className={styles.fileIcon} size={35} />
                </div>
                <div className={styles.centerTextFile}>
                  <h5>Proceso de evaluacion</h5>
                  <p>Estado de la Solicitud</p>
                </div>
              </div>
              <div className={styles.boxOpenIcon}>
                {!openFiles02 && <TbCircleChevronDown size={20} />}
                {openFiles02 && <TbCircleChevronUp size={20} />}
              </div>
            </div>

            {openFiles02 && (
              <>
                <div className={styles.boxExplainFile01}>
                  <h5>Estado de la Solicitud</h5>
                  <p>
                    Desde el panel, podrá ver el estado actual de su solicitud.
                    El sistema actualizará automáticamente el estado a medida
                    que se procesen las solicitudes, permitiéndole seguir en
                    tiempo real si su préstamo ha sido aprobado o rechazado.
                  </p>
                </div>
              </>
            )}

            <div
              onClick={() => setOpenFiles03(!openFiles03)}
              className={styles.fileBox}
            >
              <div className={styles.boxTexts}>
                <div className={styles.boxFileIcon}>
                  <TbMailBolt className={styles.fileIcon} size={35} />
                </div>
                <div className={styles.centerTextFile}>
                  <h5>Proceso de evaluacion</h5>
                  <p>Notificaciones</p>
                </div>
              </div>
              <div className={styles.boxOpenIcon}>
                {!openFiles03 && <TbCircleChevronDown size={20} />}
                {openFiles03 && <TbCircleChevronUp size={20} />}
              </div>
            </div>

            {openFiles03 && (
              <>
                <div className={styles.boxExplainFile01}>
                  <h5>Estado de la Solicitud</h5>
                  <p>
                    Desde el panel, podrá ver el estado actual de su solicitud.
                    El sistema actualizará automáticamente el estado a medida
                    que se procesen las solicitudes, permitiéndole seguir en
                    tiempo real si su préstamo ha sido aprobado o rechazado.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.listDocs}>
          <Image
            className={styles.videoInst}
            src={dashboardImage}
            alt={"logo"}
          />
        </div>
      </div>
    </>
  );
}

export default AnswerRequest;
