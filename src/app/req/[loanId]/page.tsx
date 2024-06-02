"use client";

import { useGlobalContext } from "@/context/Auth";
import { ScalarLoanApplication } from "@/types/User";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbClock, TbPencil } from "react-icons/tb";
import CardInfo from "@/components/accesories/cardInfo";

function RequestInfo({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();
  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);

  useEffect(() => {
    const loanInfo = async () => {
      const response = await axios.post(
        "/api/loan/id",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      response.data.success === true && setInfoLoan(response.data.data);
    };

    loanInfo();
  }, [params.loanId, user]);

  return (
    <>
      <main className={styles.mainLoan}>
        <h1>Detalles completos de tu prestamo</h1>

        {/* <div className={styles.DateContainer}>
          <div className={styles.dateLoan}>
            <div className={styles.boxIconDate}>
              <TbClock size={20} />
            </div>
            <h4>Fecha de creacion</h4>
          </div>
          <p>{String(infoLoan?.createdAt)}</p>
        </div> */}

        <h2 className={styles.firstTitle}>Informacion del credito</h2>
        <div className={styles.listDetails}>
          <CardInfo
            money={false}
            label={"Deudor principal"}
            text={infoLoan?.principal_debtor}
            datetime={false}
          />

          <CardInfo
            label={"Codeudor"}
            text={infoLoan?.co_debtor}
            money={false}
            datetime={false}
          />

          <CardInfo
            label={"Fecha Solicitud"}
            text={String(infoLoan?.createdAt)}
            money={false}
            datetime={true}
          />

          <CardInfo
            label={"Empresa Afiliada"}
            text={infoLoan?.affiliated_company}
            money={false}
            datetime={false}
          />

          <CardInfo
            label={"Nit"}
            text={infoLoan?.nit}
            money={false}
            datetime={false}
          />

          <CardInfo
            label={"Monto Solicitado"}
            text={infoLoan?.requested_amount}
            money={true}
            datetime={false}
          />

          <CardInfo
            label={"Plazo (Meses)"}
            text={infoLoan?.deadline}
            money={false}
            datetime={false}
          />

          <CardInfo
            label={"Pago"}
            text={infoLoan?.payment}
            money={false}
            datetime={false}
          />

          <CardInfo
            label={"Valor Cuota"}
            text={infoLoan?.quota_value}
            money={true}
            datetime={false}
          />

          {/* <CardInfo
            label={"Creditos vigentes"}
            text={infoLoan?.current_loans_affecting}
            money={false}
          /> */}
        </div>

        <h2 className={styles.secondTitle}>
          Informacion general del solicitante
        </h2>
        <div className={styles.listDetails}>
          <CardInfo
            money={false}
            label={"Primer Apellido"}
            text={infoLoan?.firtLastName}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Segundo Apellido"}
            text={infoLoan?.secondLastName}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Nombre"}
            text={infoLoan?.names}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Ocupacion, Oficio o Profesion"}
            text={infoLoan?.occupation}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Documento de identidad"}
            text={infoLoan?.typeDocument}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Personas a cargo"}
            text={infoLoan?.persons_in_charge}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Fecha de nacimiento"}
            text={String(infoLoan?.birthDate)}
            datetime={true}
          />

          <CardInfo
            money={false}
            label={"Lugar de nacimiento"}
            text={infoLoan?.place_birth}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Sexo"}
            text={infoLoan?.genre}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Estado civil"}
            text={infoLoan?.marital_status}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Telefono/Celular"}
            text={infoLoan?.cellPhone}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Destino de los recursos"}
            text={infoLoan?.destination_resources}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Antiguedad de la empresa"}
            text={infoLoan?.labor_seniority}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Direccion residencia"}
            text={infoLoan?.residence_address}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Ciudad"}
            text={infoLoan?.city}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Telefono residencia"}
            text={infoLoan?.residence_phone}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Tipo de vivienda"}
            text={infoLoan?.housing_type}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Email"}
            text={infoLoan?.email}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Whatsapp"}
            text={infoLoan?.whatsapp_number}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"Pignorado"}
            text={infoLoan?.pignorado}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"A favor de"}
            text={infoLoan?.in_favor_pignorado}
            datetime={false}
          />

          <CardInfo
            money={true}
            label={"Valor comercial"}
            text={infoLoan?.commercial_value}
            datetime={false}
          />

          <CardInfo
            money={false}
            label={"A favor de"}
            text={infoLoan?.in_favor_pignorado}
            datetime={false}
          />
        </div>

        <pre>{JSON.stringify(infoLoan, null, 2)}</pre>
      </main>
    </>
  );
}

export default RequestInfo;
