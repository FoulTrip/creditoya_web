import { ScalarEmployee, ScalarLoanApplication } from "@/types/User";
import React, { useEffect, useState } from "react";
import styles from "./styles/cardLoan.module.css";
import {
  TbBell,
  TbChecklist,
  TbMailFilled,
  TbPhoneFilled,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import CopyText from "./CopyText";
import Avatar from "react-avatar";
import { stringToPriceCOP } from "@/handlers/StringToCop";

function CardLoan({ loan }: { loan: ScalarLoanApplication }) {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [infoEmployee, setInfoEmployee] = useState<ScalarEmployee | null>(null);

  // const formattedPrice = (price: string) => {
  //   const number = parseFloat(price);

  //   const formatter = new Intl.NumberFormat("es-CO", {
  //     style: "currency",
  //     currency: "COP",
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });

  //   const formattedNumber = formatter.format(number);
  //   return formattedNumber;
  // };

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
            <h3>Solicitud de prestamo</h3>

            <div className={styles.btnsContainer}>
              <div
                className={styles.goAll}
                onClick={() => router.push(`/req/${loan.id}`)}
              >
                <h5>Detalles completos</h5>
              </div>

              <div className={styles.notificationsBox}>
                <div className={styles.headerNotBtn}>
                  <div className={styles.boxIconNot}>
                    <TbBell className={styles.iconBell} size={20} />
                  </div>
                  <h4>Notificaciones</h4>
                </div>
                {loan.newCantityOpt == null && loan.newCantity && (
                  <p className={styles.messageWarn}>
                    La cantidad aprobada ha cambiado
                  </p>
                )}
                {!loan.newCantityOpt !== null && !loan.newCantity && (
                  <p className={styles.messageNot}>Sin acciones pendientes</p>
                )}
                {loan.newCantityOpt !== null && loan.newCantity && (
                  <p className={styles.messageNot}>Sin acciones pendientes</p>
                )}
              </div>
            </div>
          </div>
        </h1>
        <div className={styles.requirements}>
          <div className={styles.boxAmount}>
            <p>Cantidad Solicitada</p>
            <h1>{stringToPriceCOP(loan.cantity)}</h1>
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

        <div className={styles.widgetsViews}>
          <div className={styles.subTextBarView}>
            <div className={styles.centerList}>
              <div className={styles.iconCheckList}>
                {loan.status == "Pendiente" ? (
                  <Avatar
                    className={styles.iconListCheck}
                    size={"30"}
                    round={true}
                  />
                ) : (
                  <Avatar
                    src={infoEmployee?.avatar}
                    className={styles.iconListCheck}
                    size={"30"}
                    round={true}
                  />
                )}
              </div>
              <p>
                {loan.status == "Pendiente"
                  ? "Esperando Asesor..."
                  : `${infoEmployee?.name} ${infoEmployee?.lastNames}`}
              </p>
              <h5>Asesor Encargado</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardLoan;
