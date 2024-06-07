"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScalarLoanApplication, ScalarPaymentLoan } from "@/types/User";
import { useGlobalContext } from "@/context/Auth";
import {
  TbArrowLeft,
  TbArrowUpRight,
  TbFileText,
  TbPointFilled,
  TbShieldCheckFilled,
} from "react-icons/tb";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Modal from "@/components/modal/Modal";
import PdfView from "@/components/payments/PdfView";
import SignaturePay from "@/components/payments/SignaturePay";

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
  const [openSignature, setOpenSignature] = useState<boolean>(false);
  const [openModel, setOpenModel] = useState<boolean>(false);

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

      if (response.data.success == true) setPayments(response.data.data);
    };

    fetchPayments();
  }, [params, user?.token]);

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

  const stringToPrice = (price: string): string => {
    const number = parseFloat(price);

    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);

    return formattedNumber;
  };

  const handlerOpenModel = () => {
    setOpenModel(!openModel);
  };

  const handlerOpenSignature = async () => {
    setOpenSignature(!openSignature);
  };

  const handleSaveSignature = async (signatureData: any) => {
    const { signatureUrl, payId } = signatureData;

    console.log(signatureUrl);

    const response = await axios.post(
      "/api/loan/payments/change_signature",
      {
        payId,
        img: signatureUrl,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    console.log(response.data);

    if (response.data.success == true) {
      const response = await axios.post(
        "/api/loan/payments/change_status",
        {
          payId,
          status: "authorized",
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      console.log(response.data);

      if (response.data.success == true) {
        const responseAll = await axios.post(
          "/api/loan/payments/byloan",
          {
            loanId: params.loanId,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        console.log(response.data);
        if (responseAll.data.success == true)
          setPayments(responseAll.data.data);
      }
    }
  };

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

      <div>
        {loanData && (
          <div className={styles.headerInfo}>
            <h1>Detalles de Pago</h1>
            <h4 className={styles.detailText}>
              Número total de cuotas:
              <span className={styles.valueP}>
                {paymentDetails.totalCuotas}
              </span>
            </h4>
            <h4 className={styles.detailText}>
              Monto de cada cuota:
              <span className={styles.valueP}>
                {stringToPrice(String(paymentDetails.cuotaAmount))}
              </span>
            </h4>
            <h4 className={styles.detailText}>
              Próxima fecha de pago:
              <span className={styles.valueP}>
                {stringToPrice(paymentDetails.nextPaymentDate)}
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
            payments?.map((details) => (
              <React.Fragment key={details.id}>
                <div>
                  <div className={styles.boxStatus}>
                    <div className={styles.boxIconStatus}>
                      <TbPointFilled
                        className={
                          details.status == "authorized"
                            ? styles.pointSuccess
                            : styles.pointError
                        }
                      />
                    </div>
                    <p className={styles.textVerify}>
                      {details.status == "authorized" && "Verificado"}
                      {details.status == "unauthorized" && "No Verificado"}
                    </p>
                  </div>
                  <div className={styles.headerStatus}>
                    <div className={styles.circleQuote}>
                      <p className={styles.centerCircleQuote}>
                        {details.quota}
                      </p>
                    </div>
                    <h2>Comprobacion de pago</h2>
                  </div>
                  <div className={styles.boxDatePay}>
                    <h5>ID Prestamo: </h5>
                    <p>{details.id}</p>
                  </div>
                  <div className={styles.boxDatePay}>
                    <h5>Fecha de creacion: </h5>
                    <p>
                      {details.createdAt
                        ? new Date(details.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                        : "Fecha no disponible"}
                    </p>
                  </div>
                  <div className={styles.boxDatePay}>
                    <h5>Cantidad pagada: </h5>
                    <p>{stringToPrice(details.quantity)}</p>
                  </div>
                  <div className={styles.btnViewPdf}>
                    <div
                      className={styles.centerBtnViewPdf}
                      onClick={handlerOpenModel}
                    >
                      <div className={styles.boxIConArrow}>
                        <TbFileText className={styles.iconArrow} />
                      </div>

                      <p className={styles.textViewDoc}>Documento PDF</p>
                      <div className={styles.boxIConArrow}>
                        <TbArrowUpRight className={styles.iconArrow} />
                      </div>
                    </div>

                    {details.status == "unauthorized" && (
                      <div
                        className={styles.centerBtnAprovePdf}
                        onClick={handlerOpenSignature}
                      >
                        <div className={styles.boxIConArrow}>
                          <TbShieldCheckFilled className={styles.iconSec} />
                        </div>
                        <p className={styles.textViewDoc}>Verificar</p>
                      </div>
                    )}
                  </div>
                </div>

                {openModel && (
                  <Modal isOpen={openModel} onClose={handlerOpenModel}>
                    <PdfView
                      idPdf={details.id as string}
                      name={details.nameClient}
                      datePay={String(details.createdAt)}
                      payQuantity={details.quantity}
                      expirationDay={paymentDetails.nextPaymentDate}
                      numberDocument={details.documentClient}
                      signature={details.signature}
                    />
                  </Modal>
                )}
                {openSignature && (
                  <Modal isOpen={openSignature} onClose={handlerOpenSignature}>
                    <SignaturePay
                      src={handleSaveSignature}
                      success={handlerOpenSignature}
                      payId={details.id as string}
                    />
                  </Modal>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </main>
  );
}

export default PaymentsLoan;
