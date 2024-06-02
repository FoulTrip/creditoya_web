"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ScalarLoanApplication, ScalarPaymentLoan } from "@/types/User";
import { useGlobalContext } from "@/context/Auth";
import {
  TbArrowLeft,
  TbCircleCheckFilled,
  TbFaceId,
  TbPhotoSearch,
  TbSquareRoundedPlusFilled,
  TbTrash,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useDropzone } from "react-dropzone";

interface Props {
  loanId: string;
}

function PaymentsLoan({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();
  const [loanData, setLoanData] = useState<ScalarLoanApplication | null>(null);
  const [payments, setPayments] = useState<ScalarPaymentLoan[] | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    monthsToPay: 0,
    totalCuotas: 0,
    cuotaAmount: 0,
    nextPaymentDate: "",
  });
  const [imagePreview1, setImagePreview1] = useState("");
  const [loadingProccessImg01, setLoadingProccessImg01] = useState(false);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/api/loan/id",
          { loanId: params.loanId },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        if (response.data.success) {
          setLoanData(response.data.data);
          calculatePaymentDetails(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user, params]);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await axios.post(
        "/api/loan/payments/byloan",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      console.log(response);

      if (response.data.success) setPayments(response.data.data);
    };

    fetchPayments();
  }, [params, user]);

  const calculatePaymentDetails = (loan: ScalarLoanApplication) => {
    // Calculate payment details based on loan data
    // Assuming payment frequency is stored in loanData.payment (e.g., 'Mensual', 'Quincenal', 'Semanal')
    let monthsToPay = 0;
    switch (loan.payment) {
      case "Mensual":
        monthsToPay = parseInt(loan.deadline) / 30;
        break;
      case "Quincenal":
        monthsToPay = parseInt(loan.deadline) / 15;
        break;
      case "Semanal":
        monthsToPay = parseInt(loan.deadline) / 7;
        break;
      default:
        break;
    }

    const totalCuotas = parseInt(loan.deadline);
    const cuotaAmount = parseFloat(loan.quota_value);

    // Calculate next payment date
    const createdDate = new Date(loan.createdAt);
    const nextPaymentDate = new Date(
      createdDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // Assuming monthly payment

    setPaymentDetails({
      monthsToPay,
      totalCuotas,
      cuotaAmount,
      nextPaymentDate: nextPaymentDate.toDateString(), // Convert next payment date to string
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setLoadingImg(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("loanId", file);

    const response = await axios.post("api/loan/payments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    console.log(response.data);
  }, []);

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({ onDrop: onDrop });

  return (
    <main className={styles.mainPay}>
      <div className={styles.barBack}>
        <div
          className={styles.centerBarBack}
          onClick={() => router.push("/dashboard")}
        >
          <div className={styles.boxIcon}>
            <TbArrowLeft size={20} className={styles.iconArrow} />
          </div>
          <p className={styles.labelBtn}>Volver</p>
        </div>
      </div>

      {loanData && (
        <div className={styles.headerInfo}>
          <h1>Detalles de Pago</h1>
          <h4 className={styles.detailText}>
            Número total de cuotas:
            <span className={styles.valueP}>{paymentDetails.totalCuotas}</span>
          </h4>
          <h4 className={styles.detailText}>
            Monto de cada cuota:
            <span className={styles.valueP}>{paymentDetails.cuotaAmount}</span>
          </h4>
          <h4 className={styles.detailText}>
            Próxima fecha de pago:
            <span className={styles.valueP}>
              {paymentDetails.nextPaymentDate}
            </span>
          </h4>
        </div>
      )}

      <div className={styles.containerPay}>
        {payments?.length === 0 && (
          <p className={styles.textRegisterVoid}>No hay registros de pago</p>
        )}
        {payments &&
          payments?.length > 0 &&
          payments?.map((details) => <div key={details.id}></div>)}
      </div>

      <div className={styles.boxImageUpload}>
        <div className={styles.boxInfoUser} {...getRootProps1()}>
          <input {...getInputProps1()} className={styles.inputImg} />
          {imagePreview1 && imagePreview1 != "No definido" ? (
            <>
              <div className={styles.barStatusDocs}>
                <div className={styles.headerCardStatus}>
                  <div className={styles.boxIconStatus}>
                    <TbCircleCheckFilled className={styles.iconCheck} />
                  </div>
                  <p className={styles.warninCC}>Comprobante subido</p>
                </div>
                <div className={styles.boxIconsStatus}>
                  <div className={styles.boxIcon}>
                    <TbPhotoSearch className={styles.viewIcon} size={20} />
                  </div>
                  <div className={styles.boxIcon}>
                    <TbTrash className={styles.trashIcon} size={20} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.containerDropDocuments}>
              <div className={styles.boxIconPreview}>
                <TbSquareRoundedPlusFilled
                  className={styles.iconPreview}
                  size={60}
                />
              </div>
              <p className={styles.textPreview}>
                {loadingProccessImg01 && "Processando pdf..."}
                {!loadingProccessImg01 && "Agregar comprobante de pago"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PaymentsLoan;
