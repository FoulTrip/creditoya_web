"use client";

import { useGlobalContext } from "@/context/Auth";
import { ScalarLoanApplication } from "@/types/User";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  TbArrowLeft,
  TbChevronDown,
  TbChevronRight,
  TbClock,
  TbPencil,
} from "react-icons/tb";
import CardInfo from "@/components/accesories/cardInfo";
import { useRouter } from "next/navigation";

function RequestInfo({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();
  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);
  const router = useRouter();

  const [openFirst, setOpenFirst] = useState<boolean>(false);
  const [openSecond, setOpenSecond] = useState<boolean>(false);
  const [openThree, setOpenThree] = useState<boolean>(false);
  const [openFour, setOpenFour] = useState<boolean>(false);
  const [openFive, setOpenFive] = useState<boolean>(false);
  const [openSix, setOpenSix] = useState<boolean>(false);

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
        <h1>Detalles completos de tu prestamo</h1>
        <p>Solicitud ID: {infoLoan?.id}</p>

        <div
          className={openSecond ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenSecond(!openSecond)}
        >
          <h3 className={styles.firstTitle}>Informacion del credito</h3>
          <div className={styles.boxChevron}>
            {!openSecond && <TbChevronRight size={20} />}
            {openSecond && <TbChevronDown size={20} />}
          </div>
        </div>
        {openSecond && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Deudor principal"}
              text={infoLoan?.principal_debtor || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              label={"Codeudor"}
              text={infoLoan?.co_debtor || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Fecha Solicitud"}
              text={String(infoLoan?.createdAt) || "Sin definir"}
              money={false}
              datetime={true}
            />

            <CardInfo
              label={"Empresa Afiliada"}
              text={infoLoan?.affiliated_company || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Nit"}
              text={infoLoan?.nit || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Monto Solicitado"}
              text={infoLoan?.requested_amount || "Sin definir"}
              money={true}
              datetime={false}
            />

            <CardInfo
              label={"Plazo (Meses)"}
              text={infoLoan?.deadline || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Pago"}
              text={infoLoan?.payment || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Valor Cuota"}
              text={infoLoan?.quota_value || "Sin definir"}
              money={true}
              datetime={false}
            />

            {/* <CardInfo
                    label={"Creditos vigentes"}
                    text={infoLoan?.current_loans_affecting}
                    money={false}
                  /> */}
          </div>
        )}

        <div
          className={openFirst ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFirst(!openFirst)}
        >
          <h3>Informacion general del solicitante</h3>
          <div className={styles.boxChevron}>
            {!openFirst && <TbChevronRight size={20} />}
            {openFirst && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFirst && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Primer Apellido"}
              text={infoLoan?.firtLastName || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Segundo Apellido"}
              text={infoLoan?.secondLastName || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Nombre"}
              text={infoLoan?.names || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ocupacion, Oficio o Profesion"}
              text={infoLoan?.occupation || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Documento de identidad"}
              text={infoLoan?.typeDocument || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Personas a cargo"}
              text={infoLoan?.persons_in_charge || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Fecha de nacimiento"}
              text={String(infoLoan?.birthDate) || "Sin definir"}
              datetime={true}
            />

            <CardInfo
              money={false}
              label={"Lugar de nacimiento"}
              text={infoLoan?.place_birth || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Sexo"}
              text={infoLoan?.genre || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Estado civil"}
              text={infoLoan?.marital_status || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono/Celular"}
              text={infoLoan?.cellPhone || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Destino de los recursos"}
              text={infoLoan?.destination_resources || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Antiguedad de la empresa"}
              text={infoLoan?.labor_seniority || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={infoLoan?.residence_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={infoLoan?.city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={infoLoan?.residence_phone || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Tipo de vivienda"}
              text={infoLoan?.housing_type || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Email"}
              text={infoLoan?.email || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Whatsapp"}
              text={infoLoan?.whatsapp_number || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Pignorado"}
              text={infoLoan?.pignorado || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"A favor de"}
              text={infoLoan?.in_favor_pignorado || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Valor comercial"}
              text={infoLoan?.commercial_value || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Otros bienes personales o familiares"}
              text={infoLoan?.other_income_other_principal || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Valor comercial"}
              text={infoLoan?.other_personal_commercial_value || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Tiene familiares en la empresa de convenio?"}
              text={
                infoLoan?.family_members_in_company_agreement || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Actualmente es codeudor de alguna obligacion crediticia?"}
              text={infoLoan?.is_currently_codebtor || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Con Credito Ya?"}
              text={infoLoan?.codebtor_in_creditoya || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Otra entidad?"}
              text={infoLoan?.other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Cual?"}
              text={infoLoan?.name_other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Monto"}
              text={infoLoan?.amount_in_the_other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Nombres y apellidos del conyugue"}
              text={infoLoan?.complete_name_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"N° identificacion"}
              text={infoLoan?.number_document_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono fijo"}
              text={infoLoan?.landline_telephone_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={infoLoan?.name_company_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono oficina"}
              text={infoLoan?.phone_company_spoue || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono celular"}
              text={infoLoan?.phone_spouse || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openThree ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenThree(!openThree)}
        >
          <h3>Informacion financiera</h3>
          <div className={styles.boxChevron}>
            {!openThree && <TbChevronRight size={20} />}
            {openThree && <TbChevronDown size={20} />}
          </div>
        </div>
        {openThree && (
          <div className={styles.listDetails}>
            <CardInfo
              money={true}
              label={"Total ingresos mensuales"}
              text={infoLoan?.total_monthly_income || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total egresos mensuales"}
              text={infoLoan?.monthly_expenses || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total activos"}
              text={infoLoan?.total_assets || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total pasivos"}
              text={infoLoan?.total_liabilities || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Patrimonio"}
              text={infoLoan?.total_liabilities || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Corte"}
              text={String(infoLoan?.court) || "Sin definir"}
              datetime={true}
            />

            <CardInfo
              money={false}
              label={"N° empleados"}
              text={infoLoan?.number_employees || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={
                "Tiene otros ingresos diferentes a la actividad economica principal en la familia?"
              }
              text={infoLoan?.other_economy_activity_principal || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Cuales?"}
              text={
                infoLoan?.which_other_economy_activity_principal ||
                "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ingresos mensuales"}
              text={
                infoLoan?.monthly_income_other_economy_activity_principal ||
                "Sin definir"
              }
              datetime={false}
            />
          </div>
        )}

        <div
          className={openFour ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFour(!openFour)}
        >
          <h3>Referencias</h3>
          <div className={styles.boxChevron}>
            {!openFour && <TbChevronRight size={20} />}
            {openFour && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFour && (
          <div className={styles.listDetails}>
            <h3>Referencias Personales</h3>
            <CardInfo
              money={false}
              label={"Apellidos y nombres"}
              text={infoLoan?.personal_reference_name || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={
                infoLoan?.personal_reference_work_company_name || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={infoLoan?.personal_reference_city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={infoLoan?.personal_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={infoLoan?.personal_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono Celular"}
              text={infoLoan?.personal_reference_number_phone || "Sin definir"}
              datetime={false}
            />

            <h3>Referencias Familiares</h3>
            <CardInfo
              money={false}
              label={"Apellidos y nombres"}
              text={infoLoan?.family_reference_name || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={
                infoLoan?.family_reference_work_company_name || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={infoLoan?.family_reference_city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={infoLoan?.family_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={
                infoLoan?.family_reference_number_residence || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono Celular"}
              text={infoLoan?.family_reference_number_phone || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openFive ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFive(!openFive)}
        >
          <h3>Clase de contrato</h3>
          <div className={styles.boxChevron}>
            {!openFive && <TbChevronRight size={20} />}
            {openFive && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFive && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Termino Fijo"}
              text={infoLoan?.fixed_term || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Labor o Obra"}
              text={infoLoan?.labor_or_work || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openSix ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenSix(!openSix)}
        >
          <h3>Datos del contrato</h3>
          <div className={styles.boxChevron}>
            {!openSix && <TbChevronRight size={20} />}
            {openSix && <TbChevronDown size={20} />}
          </div>
        </div>
        {openSix && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Fecha de vinculacion"}
              text={String(infoLoan?.createdAt) || "Sin definir"}
              datetime={true}
            />
          </div>
        )}
      </main>
    </>
  );
}

export default RequestInfo;
