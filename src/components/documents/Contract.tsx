"use client";

import React, { use, useEffect, useState } from "react";
import styles from "./Contract.module.css";
import Modal from "../modal/Modal";
import PreEnvio from "./PreEnvio";
import { useGlobalContext } from "@/context/Auth";
import {
  TbCircleDashedX,
  TbX,
  TbCircleDashed,
  TbChevronDown,
  TbInfoCircle,
} from "react-icons/tb";
import JsonBasePDF from "@/components/Jsons/PrestamoCarta.json";
import axios from "axios";
import {
  ScalarDocument,
  ScalarLoanApplication,
  ScalarUser,
} from "@/types/User";
import BarParts from "./partsContract/BarParts";
import { toast } from "sonner";

function Contract({ toggleContract }: { toggleContract: () => void }) {
  const [openFirstPart, setOpenFirstPart] = useState<boolean>(false);
  const [openSecondPart, setOpenSecondPart] = useState<boolean>(false);
  const [openThreePart, setOpenThreePart] = useState<boolean>(false);
  const [openFourPart, setOpenFourPart] = useState<boolean>(false);
  const [openFivePart, setOpenFivePart] = useState<boolean>(false);
  const [openSixPart, setOpenSixPart] = useState<boolean>(false);

  const [infoUser, setInfoUser] = useState<ScalarUser | null>(null);
  const [docsUser, setDocsUser] = useState<ScalarDocument | null>(null);

  const { user } = useGlobalContext();
  const [formData, setFormData] = useState<ScalarLoanApplication | null>(null);

  const keysLoan: (keyof ScalarLoanApplication)[] = Object.keys(
    {} as ScalarLoanApplication
  ) as (keyof ScalarLoanApplication)[];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof ScalarLoanApplication
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...(prevFormData as ScalarLoanApplication),
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/loans/create", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        toast.success("Solicitud enviada con éxito");
      } else {
        throw new Error("Error al enviar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la solicitud");
    }
  };

  useEffect(() => {
    const getInfoUser = async () => {
      const response = await axios.post(
        "/api/user/id",
        {
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const data: ScalarUser = response.data.data;
      setInfoUser(data);

      if (data) {
        setFormData((prevFormData) => ({
          ...(prevFormData as ScalarLoanApplication),
          firtLastName: data.firstLastName,
          secondLastName: data.secondLastName,
          city: data.city as string,
          email: data.email,
          whatsapp_number: data.phone_whatsapp as string,
          cellPhone: data.phone as string,
        }));
      }
    };

    const getDocumetUser = async () => {
      const response = await axios.post(
        "/api/user/doc_id",
        {
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const data: ScalarDocument = response.data.data;
      setDocsUser(data);
      if (data) {
        setFormData((prevFormData) => ({
          ...(prevFormData as ScalarLoanApplication),
          numberDocument: data.number,
          typeDocument: data.typeDocument,
        }));
      }
      // console.log(data);
    };

    getInfoUser();
    getDocumetUser();
  }, [user?.id]);

  return (
    <>
      <main className={styles.containerContract}>
        <div className={styles.barContract}>
          <div className={styles.titleActions}>
            <h2 className={styles.titleContract}>SOLICITUD DE CREDITO</h2>
          </div>

          <div className={styles.centerTitleAction}>
            <div className={styles.boxIconClose} onClick={toggleContract}>
              <TbX className={styles.iconClose} size={20} />
            </div>
          </div>
        </div>

        <div className={styles.listParts}>
          <BarParts
            titleBar={"Informacion del credito"}
            openBar={() => setOpenFirstPart(!openFirstPart)}
            openBarStatus={openFirstPart}
            inputsComplete={false}
          />
          {openFirstPart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Empresa afiliada</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.affiliated_company || ""}
                    onChange={(e) => handleInputChange(e, "affiliated_company")}
                    name={keysLoan.find((key) => key === "affiliated_company")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Nit</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.nit}
                    onChange={(e) => handleInputChange(e, "nit")}
                    name={keysLoan.find((key) => key === "nit")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Monto solicitado</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.requested_amount}
                    onChange={(e) => handleInputChange(e, "requested_amount")}
                    name={keysLoan.find((key) => key === "requested_amount")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Plazo (Meses)</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.deadline}
                    onChange={(e) => handleInputChange(e, "deadline")}
                    name={keysLoan.find((key) => key === "deadline")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Pago</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.payment}
                    onChange={(e) => handleInputChange(e, "payment")}
                    name={keysLoan.find((key) => key === "payment")}
                  >
                    <option className={styles.optionSelect} value="Semanal">
                      Semanal
                    </option>
                    <option className={styles.optionSelect} value="Quincenal">
                      Quincenal
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Mensual
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Valor cuota</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.quota_value}
                    onChange={(e) => handleInputChange(e, "quota_value")}
                    name={keysLoan.find((key) => key === "quota_value")}
                  />
                </div>
              </div>
            </>
          )}

          <BarParts
            titleBar={"Informacion General del solicitante"}
            openBar={() => setOpenSecondPart(!openSecondPart)}
            inputsComplete={false}
            openBarStatus={false}
          />
          {openSecondPart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Primer Apellido</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={infoUser?.firstLastName || ""}
                    onChange={(e) => handleInputChange(e, "firtLastName")}
                    name={keysLoan.find((key) => key === "firtLastName")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Segundo Apellido</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.secondLastName || ""}
                    onChange={(e) => handleInputChange(e, "secondLastName")}
                    name={keysLoan.find((key) => key === "secondLastName")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Nombres</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={infoUser?.names || ""}
                    onChange={(e) => handleInputChange(e, "names")}
                    name={keysLoan.find((key) => key === "names")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ocupacion, Oficio o Profesion</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.occupation || ""}
                    onChange={(e) => handleInputChange(e, "occupation")}
                    name={keysLoan.find((key) => key === "occupation")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Documento de identidad</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.typeDocument || ""}
                    onChange={(e) => handleInputChange(e, "typeDocument")}
                    name={keysLoan.find((key) => key === "typeDocument")}
                  >
                    <option className={styles.optionSelect} value="Semanal">
                      C.C.
                    </option>
                    <option className={styles.optionSelect} value="Quincenal">
                      C.E.
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Pasaporte
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Numero de documento</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.numberDocument || ""}
                    onChange={(e) => handleInputChange(e, "numberDocument")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Personas a cargo</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.persons_in_charge || ""}
                    onChange={(e) => handleInputChange(e, "persons_in_charge")}
                    name={keysLoan.find((key) => key === "persons_in_charge")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Fecha de nacimiento</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="date"
                    value={
                      infoUser?.birth_day instanceof Date
                        ? infoUser.birth_day.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleInputChange(e, "birthDate")}
                    name={keysLoan.find((key) => key === "birthDate")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Lugar de nacimiento</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.place_birth || ""}
                    onChange={(e) => handleInputChange(e, "place_birth")}
                    name={keysLoan.find((key) => key === "place_birth")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Sexo</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.genre || ""}
                    onChange={(e) => handleInputChange(e, "genre")}
                    name={keysLoan.find((key) => key === "genre")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Estado Civil</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.marital_status || ""}
                    onChange={(e) => handleInputChange(e, "marital_status")}
                    name={keysLoan.find((key) => key === "marital_status")}
                  >
                    <option className={styles.optionSelect} value="Semanal">
                      Casado
                    </option>
                    <option className={styles.optionSelect} value="Quincenal">
                      Soltero
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Separado
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Divorsiado
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Union libre
                    </option>
                    <option className={styles.optionSelect} value="Mensual">
                      Viudo
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono / Celular</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.cellPhone || ""}
                    onChange={(e) => handleInputChange(e, "cellPhone")}
                    name={keysLoan.find((key) => key === "cellPhone")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Destino de los recursos</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.destination_resources || ""}
                    onChange={(e) =>
                      handleInputChange(e, "destination_resources")
                    }
                    name={keysLoan.find(
                      (key) => key === "destination_resources"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Antiguedad de la empresa</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.labor_seniority || ""}
                    onChange={(e) => handleInputChange(e, "labor_seniority")}
                    name={keysLoan.find((key) => key === "labor_seniority")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Direccion residencia</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.residence_address || ""}
                    onChange={(e) => handleInputChange(e, "residence_address")}
                    name={keysLoan.find((key) => key === "residence_address")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ciudad</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.city || ""}
                    onChange={(e) => handleInputChange(e, "city")}
                    name={keysLoan.find((key) => key === "city")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono de residencia</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.residence_phone || ""}
                    onChange={(e) => handleInputChange(e, "residence_phone")}
                    name={keysLoan.find((key) => key === "residence_phone")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Tipo de vivienda</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.housing_type || ""}
                    onChange={(e) => handleInputChange(e, "housing_type")}
                    name={keysLoan.find((key) => key === "housing_type")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Email</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.email || ""}
                    onChange={(e) => handleInputChange(e, "email")}
                    name={keysLoan.find((key) => key === "email")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Posee Vehiculo?</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.vehicle || ""}
                    onChange={(e) => handleInputChange(e, "vehicle")}
                    name={keysLoan.find((key) => key === "vehicle")}
                  >
                    <option className={styles.optionSelect} value="No">
                      No
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      Si
                    </option>
                  </select>
                </div>

                {formData?.vehicle == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>Marca</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle size={20} />
                      </div>
                    </div>
                    <input
                      className={styles.inputInfo}
                      type="text"
                      value={formData?.vehicleType || ""}
                      onChange={(e) => handleInputChange(e, "vehicleType")}
                      name={keysLoan.find((key) => key === "vehicleType")}
                    />
                  </div>
                )}

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Numero de Whatsapp</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.whatsapp_number || ""}
                    onChange={(e) => handleInputChange(e, "whatsapp_number")}
                    name={keysLoan.find((key) => key === "whatsapp_number")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Pignorado</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.pignorado || ""}
                    onChange={(e) => handleInputChange(e, "pignorado")}
                    name={keysLoan.find((key) => key === "pignorado")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>A favor de</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.in_favor_pignorado || ""}
                    onChange={(e) => handleInputChange(e, "in_favor_pignorado")}
                    name={keysLoan.find((key) => key === "in_favor_pignorado")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Valor comercial</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.commercial_value || ""}
                    onChange={(e) => handleInputChange(e, "commercial_value")}
                    name={keysLoan.find((key) => key === "commercial_value")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Otros Bienes personales o familiares (describelos)</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.other_income_other_principal || ""}
                    onChange={(e) =>
                      handleInputChange(e, "other_income_other_principal")
                    }
                    name={keysLoan.find(
                      (key) => key === "other_income_other_principal"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>valor comercial</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.other_personal_commercial_value || ""}
                    onChange={(e) =>
                      handleInputChange(e, "other_personal_commercial_value")
                    }
                    name={keysLoan.find(
                      (key) => key === "other_personal_commercial_value"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Tiene familiares en la empresa de convenio</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.family_members_in_company_agreement || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "family_members_in_company_agreement"
                      )
                    }
                    name={keysLoan.find(
                      (key) => key === "family_members_in_company_agreement"
                    )}
                  >
                    <option className={styles.optionSelect} value="No">
                      No
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      Si
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>
                      Actualmente es codeudor de alguna obligacion crediticia?
                    </p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.is_currently_codebtor || ""}
                    onChange={(e) =>
                      handleInputChange(e, "is_currently_codebtor")
                    }
                    name={keysLoan.find(
                      (key) => key === "is_currently_codebtor"
                    )}
                  >
                    <option className={styles.optionSelect} value="No">
                      No
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      Si
                    </option>
                  </select>
                </div>

                {formData?.is_currently_codebtor == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>Con Credito Ya?</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle size={20} />
                      </div>
                    </div>
                    <select
                      className={styles.boxSelect}
                      value={formData?.codebtor_in_creditoya || ""}
                      onChange={(e) =>
                        handleInputChange(e, "codebtor_in_creditoya")
                      }
                      name={keysLoan.find(
                        (key) => key === "codebtor_in_creditoya"
                      )}
                    >
                      <option className={styles.optionSelect} value="No">
                        No
                      </option>
                      <option className={styles.optionSelect} value="Si">
                        Si
                      </option>
                    </select>
                  </div>
                )}

                {formData?.codebtor_in_creditoya == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>De quien?</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle size={20} />
                      </div>
                    </div>
                    <input
                      className={styles.inputInfo}
                      type="text"
                      value={formData?.codebtor_origin_creditoya || ""}
                      onChange={(e) =>
                        handleInputChange(e, "codebtor_origin_creditoya")
                      }
                      name={keysLoan.find(
                        (key) => key === "codebtor_origin_creditoya"
                      )}
                    />
                  </div>
                )}

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Otra entidad?</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.other_entity || ""}
                    onChange={(e) => handleInputChange(e, "other_entity")}
                    name={keysLoan.find((key) => key === "other_entity")}
                  >
                    <option className={styles.optionSelect} value="No">
                      No
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      Si
                    </option>
                  </select>
                </div>

                {formData?.other_entity == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>Cual?</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle size={20} />
                      </div>
                    </div>
                    <input
                      className={styles.inputInfo}
                      type="text"
                      value={formData?.codebtor_origin_creditoya || ""}
                      onChange={(e) =>
                        handleInputChange(e, "codebtor_origin_creditoya")
                      }
                      name={keysLoan.find(
                        (key) => key === "codebtor_origin_creditoya"
                      )}
                    />
                  </div>
                )}

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Monto</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.amount_in_the_other_entity || ""}
                    onChange={(e) =>
                      handleInputChange(e, "amount_in_the_other_entity")
                    }
                    name={keysLoan.find(
                      (key) => key === "amount_in_the_other_entity"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Nombre y apellidos de conyugue</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.complete_name_spouse || ""}
                    onChange={(e) =>
                      handleInputChange(e, "complete_name_spouse")
                    }
                    name={keysLoan.find(
                      (key) => key === "complete_name_spouse"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Numero de identificacion del conyugue</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.number_document_spouse || ""}
                    onChange={(e) =>
                      handleInputChange(e, "number_document_spouse")
                    }
                    name={keysLoan.find(
                      (key) => key === "number_document_spouse"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono fijo del conyugue</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.phone_spouse || ""}
                    onChange={(e) => handleInputChange(e, "phone_spouse")}
                    name={keysLoan.find((key) => key === "phone_spouse")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono Oficina del conyugue</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.phone_company_spoue || ""}
                    onChange={(e) =>
                      handleInputChange(e, "phone_company_spoue")
                    }
                    name={keysLoan.find((key) => key === "phone_company_spoue")}
                  />
                </div>
              </div>
            </>
          )}

          <BarParts
            titleBar={"Informacion financiera"}
            openBar={() => setOpenThreePart(!openThreePart)}
            inputsComplete={false}
            openBarStatus={openThreePart}
          />
          {openThreePart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total ingresos mensuales</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.monthly_income || ""}
                    onChange={(e) => handleInputChange(e, "monthly_income")}
                    name={keysLoan.find((key) => key === "monthly_income")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total egresos mensuales</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.monthly_expenses || ""}
                    onChange={(e) => handleInputChange(e, "monthly_expenses")}
                    name={keysLoan.find((key) => key === "monthly_expenses")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total activos</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.total_assets || ""}
                    onChange={(e) => handleInputChange(e, "total_assets")}
                    name={keysLoan.find((key) => key === "total_assets")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total Pasivos</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.total_liabilities || ""}
                    onChange={(e) => handleInputChange(e, "total_liabilities")}
                    name={keysLoan.find((key) => key === "total_liabilities")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Patrimonio</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.patrimony || ""}
                    onChange={(e) => handleInputChange(e, "patrimony")}
                    name={keysLoan.find((key) => key === "patrimony")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Valor cuota</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.quota_value}
                    onChange={(e) => handleInputChange(e, "quota_value")}
                    name={keysLoan.find((key) => key === "quota_value")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Corte</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="date"
                    value={
                      formData?.court instanceof Date
                        ? formData.court.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleInputChange(e, "court")}
                    name={keysLoan.find((key) => key === "court")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>N° de empleados</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.number_employees || ""}
                    onChange={(e) => handleInputChange(e, "number_employees")}
                    name={keysLoan.find((key) => key === "number_employees")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Tiene otros ingresos diferentes a la principal?</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.other_income_other_principal || ""}
                    onChange={(e) =>
                      handleInputChange(e, "other_income_other_principal")
                    }
                    name={keysLoan.find(
                      (key) => key === "other_income_other_principal"
                    )}
                  >
                    <option className={styles.optionSelect} value="No">
                      No
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      Si
                    </option>
                  </select>
                </div>

                {formData?.other_income_other_principal == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>Cuales</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle size={20} />
                      </div>
                    </div>
                    <input
                      className={styles.inputInfo}
                      type="text"
                      value={formData?.which_other_income || ""}
                      onChange={(e) =>
                        handleInputChange(e, "which_other_income")
                      }
                      name={keysLoan.find(
                        (key) => key === "which_other_income"
                      )}
                    />
                  </div>
                )}

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ingreso mensual</p>
                    <div className={styles.boxIconInfo}>
                      <TbInfoCircle size={20} />
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.monthly_income || ""}
                    onChange={(e) => handleInputChange(e, "monthly_income")}
                    name={keysLoan.find((key) => key === "monthly_income")}
                  />
                </div>
              </div>
            </>
          )}

          <BarParts
            titleBar={"Referencias (Personas que no viven con usted)"}
            openBar={() => setOpenFourPart(!openFourPart)}
            inputsComplete={false}
            openBarStatus={openFourPart}
          />
          {openFourPart && (
            <>
              <p>Hola</p>
            </>
          )}

          <BarParts
            titleBar={"Datos del contrato"}
            openBar={() => setOpenFivePart(!openFivePart)}
            inputsComplete={false}
            openBarStatus={openFivePart}
          />
          {openFivePart && (
            <>
              <p>Hola</p>
            </>
          )}

          <BarParts
            titleBar={"Creditos vigentes que afecten su nomina"}
            openBar={() => setOpenSixPart(!openSixPart)}
            inputsComplete={false}
            openBarStatus={openSixPart}
          />
          {openSixPart && (
            <>
              <p>Hola</p>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Contract;
