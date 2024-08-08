import {
  ScalarDocument,
  ScalarLoanApplication,
  ScalarUser,
} from "@/types/User";
import React, { useEffect, useState } from "react";
import styles from "./listDocs.module.css";
import Modal from "../modal/Modal";
import Document00 from "../pdfs/pdfCard00";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import Document04 from "../pdfs/pdfCard03";
import { Document01 } from "../pdfs/pdfCard01";
import Document03 from "../pdfs/pdfCard03";

function ListPdfsAutogenerate({ data }: { data: ScalarLoanApplication }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [optionView, setOptionView] = useState<number | null>(null);
  const handleOpenViewDoc = (option: number) => {
    setOpenModal(!openModal);
    setOptionView(option);
  };
  const [numberDocument, setNumberDocument] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const { user } = useGlobalContext();

  useEffect(() => {
    const getInfoDoc = async () => {
      const response = await axios.post(
        "/api/user/doc_id",
        {
          userId: data.userId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.success) {
        const data: ScalarDocument = response.data.data;
        setNumberDocument(data.number as string);
      }
    };

    const getInfoUser = async () => {
      const response = await axios.post(
        "/api/user/id",
        {
          userId: data.userId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // console.log(response.data)

      if (response.data.success) {
        const data: ScalarUser = response.data.data;
        setName(`${data.names} ${data.firstLastName} ${data.secondLastName}`);
      }
    };

    getInfoDoc();
    getInfoUser();
  }, [data, user?.token]);

  // console.log(data);

  return (
    <>
      <h3 className={styles.tltleDoc}>Documentos generados con tus firma</h3>
      <div className={styles.listDocs}>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Autorizacion centrales de riesgo</p>
            <div className={styles.boxIconPdf}>
              <button
                className={styles.btnIcon}
                onClick={() => handleOpenViewDoc(0)}
              >
                Ver
              </button>
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Autorizacion de cobro</p>
            <div className={styles.boxIconPdf}>
              <button
                className={styles.btnIcon}
                onClick={() => handleOpenViewDoc(1)}
              >
                Ver
              </button>
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Autorizacion descuento nomina</p>
            <div className={styles.boxIconPdf}>
              <button
                className={styles.btnIcon}
                onClick={() => handleOpenViewDoc(2)}
              >
                Ver
              </button>
            </div>
          </div>
        </div>
        <div className={styles.cardDoc}>
          <div className={styles.headerCardDoc}>
            <p>Pagare</p>
            <div className={styles.boxIconPdf}>
              <button
                className={styles.btnIcon}
                onClick={() => handleOpenViewDoc(3)}
              >
                Ver
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {optionView == 0 && (
          <Document00
            numberDocument={numberDocument as string}
            entity={data.entity}
            numberBank={data.bankNumberAccount}
            signature={data.signature}
          />
        )}
        {optionView == 1 && (
          <Document01
            numberDocument={numberDocument as string}
            signature={data.signature}
            name={name as string}
          />
        )}
        {optionView == 2 && (
          <Document03
            name={name as string}
            numberDocument={numberDocument as string}
          />
        )}
        {optionView == 3 && (
          <Document04
            name={name as string}
            numberDocument={numberDocument as string}
            signature={data.signature}
          />
        )}
      </Modal>
    </>
  );
}

export default ListPdfsAutogenerate;
