import { ScalarLoanApplication } from "@/types/User";
import React, { useState } from "react";
import styles from "./styles/cardLoan.module.css";
import {
  TbArrowNarrowDown,
  TbChevronDown,
  TbChevronUp,
  TbClockSearch,
  TbEye,
  TbFileTypePdf,
} from "react-icons/tb";
import EditInfo from "./EditInfo";

function CardLoan({ loan }: { loan: ScalarLoanApplication }) {
  const [openDetails, setOpenDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setOpenDetails(!openDetails);
  };

  return (
    <>
      <div className={styles.cardLoan}>
        <div className={styles.headerStatus}>
          <div className={styles.centerHeaderStatus}>
            <div className={styles.iconHeaderStatus}>
              <TbClockSearch className={styles.iconHeader} size={20} />
            </div>
            <p>{loan.status}</p>
          </div>
        </div>

        <div className={styles.containerValueBox}>
          <div className={styles.centerValueBox}>
            <h3 className={styles.titleCantity}>Cantidad</h3>
            <p className={styles.textValueCantity}>2'300'000 COP</p>
          </div>
          <div className={styles.centerValueBox}>
            <h3 className={styles.titleCantity}>Plazo de pago</h3>
            <p className={styles.textValueCantity}>30 dias</p>
          </div>
        </div>

        <div className={styles.barViewDetails}>
          <div className={styles.subBarView} onClick={toggleDetails}>
            <p className={styles.subTextBarView}>Detalles</p>
            <div className={styles.boxChevron}>
              {openDetails ? (
                <TbChevronUp className={styles.iconChevron} size={20} />
              ) : (
                <TbChevronDown className={styles.iconChevron} size={20} />
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
            <button className={styles.btnCanclLoan}>Cancelar Credito</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardLoan;
