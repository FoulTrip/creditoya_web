"use client";

import React, { useState } from "react";
import styles from "./docsRequire.module.css";
import { TbCircleChevronDown, TbCircleChevronUp, TbFile } from "react-icons/tb";

function DocsRequires() {
  const [openFiles01, setOpenFiles01] = useState<boolean>(false);
  const [openFiles02, setOpenFiles02] = useState<boolean>(false);
  return (
    <>
      <div className={styles.docsRequires}>
        <div className={styles.partDocsRequires}>
          <div className={styles.Index}>
            <div className={styles.boxIndex}>
              <h5 className={styles.circleIndex}>1</h5>
            </div>
            <h2>Recolecta los documentos necesarios</h2>
          </div>
          <p className={styles.textExplain}>
            Para facilitar el proceso de solicitud de su préstamo, le
            solicitamos que tenga preparados los documentos necesarios al
            momento de realizar su solicitud. Asegúrese de contar con la
            documentación actualizada y completa, ya que esto permitirá una
            evaluación más ágil y precisa de su solicitud.
          </p>
        </div>

        <div className={styles.listDocs}>
          <div
            onClick={() => setOpenFiles01(!openFiles01)}
            className={styles.fileBox}
          >
            <div className={styles.boxTexts}>
              <div className={styles.boxFileIcon}>
                <TbFile className={styles.fileIcon} size={35} />
              </div>
              <div className={styles.centerTextFile}>
                <h5>Documento PDF</h5>
                <p>Tres ultimos volantes de pago</p>
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
                <h5>Ultimos tres volantes de pago:</h5>
                <p>
                  Estos boletos demuestran su historial de ingresos reciente y
                  ayudan a verificar su capacidad de pago.
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
                <TbFile className={styles.fileIcon} size={35} />
              </div>
              <div className={styles.centerTextFile}>
                <h5>Documento PDF</h5>
                <p>Carta laboral - Actualizada</p>
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
                <h5>Carta laboral actualizada:</h5>
                <p>
                  Este documento debe ser proporcionado por su empleador y
                  confirmar su puesto, salario y antigüedad en la empresa.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DocsRequires;
