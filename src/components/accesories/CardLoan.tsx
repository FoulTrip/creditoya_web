import { ScalarEmployee, ScalarLoanApplication } from "@/types/User";
import React, { useEffect, useState } from "react";
import styles from "./styles/cardLoan.module.css";
import { TbChecklist, TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import Avatar from "react-avatar";

function CardLoan({ loan }: { loan: ScalarLoanApplication }) {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [infoEmployee, setInfoEmployee] = useState<ScalarEmployee | null>(null);

  const formattedPrice = (price: string) => {
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

  useEffect(() => {
    const getEmployee = async () => {
      const response = await axios.post(
        "/api/employee/id",
        {
          employeeId: loan.employeeId,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      if (response.data.success) setInfoEmployee(response.data.data);
    };

    getEmployee();
  }, [user?.token, loan.employeeId]);

  return (
    <>
      <div className={styles.cardLoan}>
        <h1 className={styles.titleCardLoan}>
          <div className={styles.prevInfo}>
            <h5 className={styles.titleId}>Solicitud</h5>
            <h5 className={styles.textId}>{loan.id}</h5>
            {/* <h4>Prestamo</h4> */}
          </div>
        </h1>
        <div className={styles.requirements}>
          <div className={styles.boxAmount}>
            <p>Cantidad Solicitada</p>
            <h1>{formattedPrice(loan.cantity)}</h1>
          </div>
        </div>

        <div className={styles.boxBtnsDesicion}>
          <div className={styles.centerBoxBtnsDesicion}>
            <div className={styles.boxStatusLoan}>
              <h5>Estado de prestamo</h5>
              {loan.status === "Pendiente" && (
                <h1 className={styles.statusTextPendiente}>{loan.status}</h1>
              )}
              {loan.status === "Aprobado" && (
                <h1 className={styles.statusTextSuccess}>{loan.status}</h1>
              )}
              {loan.status === "Rechazado" && (
                <h1 className={styles.statusTextReject}>{loan.status}</h1>
              )}
            </div>
          </div>
        </div>

        <div
          className={styles.widgetsViews}
          onClick={() => router.push(`/req/${loan.id}`)}
        >
          <div className={styles.subTextBarView}>
            <div className={styles.centerList}>
              <div className={styles.iconCheckList}>
                <TbChecklist className={styles.iconListCheck} size={30} />
              </div>
              <p>Datos completos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardLoan;
