import { ScalarLoanApplication } from "@/types/User";
import React from "react";
import styles from "./listDocs.module.css";
import { TbPdf } from "react-icons/tb";
import Modal from "../modal/Modal";

function ListPdfsAutogenerate({ data }: { data: ScalarLoanApplication }) {
  return (
    <>
      <h3>Otros documentos</h3>
      <div className={styles.listDocs}>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Primer documento</p>
            <div className={styles.boxIconPdf}>
              <TbPdf size={20} className={styles.iconPdf} />
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Segundo documento</p>
            <div className={styles.boxIconPdf}>
              <TbPdf size={20} className={styles.iconPdf} />
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Tercer documento</p>
            <div className={styles.boxIconPdf}>
              <TbPdf size={20} className={styles.iconPdf} />
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Cuarto documento</p>
            <div className={styles.boxIconPdf}>
              <TbPdf size={20} className={styles.iconPdf} />
            </div>
          </div>
        </div>
      </div>

      {/* <Modal */}
    </>
  );
}

export default ListPdfsAutogenerate;
