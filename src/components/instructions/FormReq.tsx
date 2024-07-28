"use client";

import React, { useState } from "react";
import styles from "./docsRequire.module.css";
import Video from "next-video";
import {
  TbCircleChevronDown,
  TbCircleChevronUp,
  TbShield,
} from "react-icons/tb";

function FormRequest() {
  const [openFiles01, setOpenFiles01] = useState<boolean>(false);
  const [openFiles02, setOpenFiles02] = useState<boolean>(false);
  return (
    <>
      <div className={styles.docsRequires}>
        <div className={styles.partDocsRequires}>
          <div className={styles.Index}>
            <div className={styles.boxIndex}>
              <h5 className={styles.circleIndex}>2</h5>
            </div>
            <h2>Completa el formulario</h2>
          </div>
          <p className={styles.textExplain}>
            Complete el formulario con los datos requeridos, incluyendo el
            nombre de la entidad bancaria, el número de cuenta y el monto del
            préstamo solicitado. Este paso es crucial para asegurar que el
            préstamo sea dirigido a la cuenta correcta y que el monto solicitado
            sea claramente especificado.
          </p>

          <h4 className={styles.titleDetails}>Algunos detalles del proceso</h4>
          <div className={styles.listSupDocs}>
            <div
              onClick={() => setOpenFiles01(!openFiles01)}
              className={styles.fileBox}
            >
              <div className={styles.boxTexts}>
                <div className={styles.boxFileIcon}>
                  <TbShield className={styles.fileIcon} size={35} />
                </div>
                <div className={styles.centerTextFile}>
                  <h5>Seguridad y privacidad</h5>
                  <p>Firma y Revisión</p>
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
                  <h5>Firma y Revision</h5>
                  <p>
                    Firme los documentos según sea necesario y revise toda la
                    información antes de enviarla. La firma es requerida para
                    autenticar que los datos proporcionados son correctos y que
                    acepta los términos y condiciones del préstamo.
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
                  <TbShield className={styles.fileIcon} size={35} />
                </div>
                <div className={styles.centerTextFile}>
                  <h5>Seguridad y privacidad</h5>
                  <p>Código de Confirmación</p>
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
                  <h5>Codigo de confirmacion</h5>
                  <p>
                    Una vez que haya completado el formulario y adjuntado los
                    documentos, se le enviará un código de confirmación a su
                    correo electrónico. Este código es una medida de seguridad
                    para verificar su identidad y asegurar que la solicitud es
                    legítima.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.listDocs}>
          <Video
            className={styles.videoInst}
            src={
              "https://res.cloudinary.com/dvquomppa/video/upload/v1722026300/videos_guia/khzhbmdbfigyqdp6mhd1.mp4"
            }
            autoPlay
            loop
          />
        </div>
      </div>
    </>
  );
}

export default FormRequest;
