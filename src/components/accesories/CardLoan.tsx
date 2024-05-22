import { ScalarLoanApplication } from "@/types/User";
import React, { useEffect, useState } from "react";
import styles from "./styles/cardLoan.module.css";
import {
  TbArrowNarrowDown,
  TbChevronDown,
  TbChevronRight,
  TbChevronUp,
  TbCircleCheck,
  TbClockSearch,
  TbEye,
  TbFileTypePdf,
} from "react-icons/tb";
import EditInfo from "./EditInfo";
import socket from "@/Socket/Socket";
import { useRouter } from "next/navigation";

function CardLoan({ loan }: { loan: ScalarLoanApplication }) {
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    socket.on("updateLoanClient", (data) => {});
  });

  const toggleDetails = () => {
    setOpenDetails(!openDetails);
  };

  return (
    <>
      <div className={styles.cardLoan}>
        <div className={styles.headerStatus}>
          <div className={styles.centerHeaderStatus}>
            <div className={styles.iconHeaderStatus}>
              {loan.status === "Pendiente" && (
                <TbClockSearch className={styles.iconHeader} size={20} />
              )}
              {loan.status === "Aprobado" && (
                <TbCircleCheck className={styles.iconHeader} size={20} />
              )}
            </div>
            <p>{loan.status}</p>
          </div>
        </div>

        <div className={styles.containerValueBox}>
          <div className={styles.centerValueBox}>
            <h3 className={styles.titleCantity}>Cantidad</h3>
            <p className={styles.textValueCantity}>$ {loan.requested_amount}</p>
          </div>
          <div className={styles.centerValueBox}>
            <h3 className={styles.titleCantity}>Plazo de pago</h3>
            <p className={styles.textValueCantity}>30 dias</p>
          </div>
          <div className={styles.centerValueBox}>
            <h3 className={styles.titleCantity}>Ganancia mensual</h3>
            <p className={styles.textValueCantity}>{loan.monthly_income}</p>
          </div>
        </div>

        <div className={styles.barViewDetails}>
          <div
            className={styles.subBarView}
            onClick={() => router.push(`/req/${loan.id}`)}
          >
            <p className={styles.subTextBarView}>Datos completos</p>
            <div className={styles.boxChevron}>
              <TbChevronRight className={styles.iconChevron} size={20} />
            </div>
          </div>
        </div>

        <div className={styles.barViewDetails}>
          <div className={styles.subBarView} onClick={toggleDetails}>
            <p className={styles.subTextBarView}>Pagos</p>
            <div className={styles.boxChevron}>
              {openDetails ? (
                <TbChevronRight className={styles.iconChevron} size={20} />
              ) : (
                <TbChevronRight className={styles.iconChevron} size={20} />
              )}
            </div>
          </div>
          {openDetails && (
            <>
              <div className={styles.listDetails}>
                <EditInfo label="Entidad" text={loan.entity} />
                {loan.bankCurrentAccount == true && (
                  <EditInfo label="Tipo" text={"Cuenta Corriente"} />
                )}
                {loan.bankSavingAccount == true && (
                  <EditInfo label="Tipo" text={"Cuenta Corriente"} />
                )}
                <EditInfo label="Cuenta" text={loan.bankNumberAccount} />
              </div>
            </>
          )}
        </div>

        <div className={styles.recurses}>
          <div className={styles.subBarViewRecurses}>
            <div className={styles.BoxInfoPdf}>
              <div className={styles.boxIconDocument}>
                <TbFileTypePdf className={styles.iconpdf} size={25} />
              </div>
              <p className={styles.labelIconDoc}>Contrato</p>
            </div>
            <div className={styles.optPdf}>
              <div className={styles.btnAction}>
                <TbEye className={styles.iconBtnAction} />
              </div>
              <div className={styles.btnAction}>
                <TbArrowNarrowDown className={styles.iconBtnAction} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.boxBtnsDesicion}>
          <div className={styles.centerBoxBtnsDesicion}>
            <button className={styles.btnRenov}>Renovar Credito</button>
            {loan.status === "Aprobado" && (
              <div className={styles.boxInfoAdvisor}>
                <h5>Asesor encargado</h5>
                <p>David Vasquez Mahecha</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardLoan;
