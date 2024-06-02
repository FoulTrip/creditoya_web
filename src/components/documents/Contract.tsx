"use client";

import React, { useEffect, useState } from "react";
import styles from "./Contract.module.css";
import { useGlobalContext } from "@/context/Auth";
import { TbInfoCircle } from "react-icons/tb";
import axios from "axios";
import {
  ScalarDocument,
  ScalarLoanApplication,
  ScalarUser,
} from "@/types/User";
import BarParts from "./partsContract/BarParts";
import { toast } from "sonner";

import {
  keysLoan,
  keysLoan01,
  keysLoan02,
  keysLoan03,
  keysLoan04,
  keysLoan05,
  keysLoan06,
} from "./partsContract/KeysLoan";

import { isRequired, sectionInputs } from "@/handlers/ContractHandlers";
import socket from "@/Socket/Socket";
import Modal from "../modal/Modal";

function Contract({ toggleContract }: { toggleContract: () => void }) {
  const [openFirstPart, setOpenFirstPart] = useState<boolean>(false);
  const [openSecondPart, setOpenSecondPart] = useState<boolean>(false);
  const [openThreePart, setOpenThreePart] = useState<boolean>(false);
  const [openFourPart, setOpenFourPart] = useState<boolean>(false);
  const [openFivePart, setOpenFivePart] = useState<boolean>(false);
  const [openSixPart, setOpenSixPart] = useState<boolean>(false);

  const { user } = useGlobalContext();
  const [formData, setFormData] = useState<ScalarLoanApplication | null>(null);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [infoModel, setInfoModel] = useState<string | null>(null);

  useEffect(() => {
    socket.emit("connected", "Hello from Contract");
  }, []);

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
      console.log(formData);
      socket.emit("create_loan_request", formData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la solicitud");
    }
  };

  const handleInfoInput = ({
    option,
  }: {
    option: keyof ScalarLoanApplication | null;
  }): void => {
    setInfoModel(option);
  };

  const handleOpenModel = () => {
    setOpenInfo(!openInfo);
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
      // setInfoUser(data);

      if (data) {
        setFormData((prevFormData) => ({
          ...(prevFormData as ScalarLoanApplication),
          names: data.names,
          firtLastName: data.firstLastName,
          secondLastName: data.secondLastName,
          city: data.city as string,
          email: data.email,
          whatsapp_number: data.phone_whatsapp as string,
          cellPhone: data.phone as string,
          birthDate: data.birth_day as Date,
          userId: data.id as string,
          genre: data.genre as string,
          place_birth: data.place_of_birth as string,
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
      // setDocsUser(data);
      if (data) {
        setFormData((prevFormData) => ({
          ...(prevFormData as ScalarLoanApplication),
          numberDocument: data.number as string,
          typeDocument: data.typeDocument,
          ccNumber: data.number as string,
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
            <h2 className={styles.titleContract}>Solicitud de credito</h2>
          </div>

          <div className={styles.centerTitleAction}>
            <div className={styles.boxIconClose} onClick={toggleContract}>
              {/* <TbX className={styles.iconClose} size={20} /> */}
              <h3>Cancelar</h3>
            </div>
          </div>
        </div>

        <div className={styles.listParts}>
          <BarParts
            titleBar={"Informacion del credito"}
            openBar={() => setOpenFirstPart(!openFirstPart)}
            openBarStatus={openFirstPart}
            inputsComplete={sectionInputs({
              key: keysLoan01,
              formData: formData as ScalarLoanApplication,
            })}
          />
          {openFirstPart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Deudor Principal</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("principal_debtor")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "principal_debtor",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.principal_debtor || ""}
                    onChange={(e) => handleInputChange(e, "principal_debtor")}
                    name={keysLoan.find((key) => key === "principal_debtor")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Codeudor</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("co_debtor") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "co_debtor",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.co_debtor || ""}
                    onChange={(e) => handleInputChange(e, "co_debtor")}
                    name={keysLoan.find((key) => key === "co_debtor")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Empresa afiliada</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("affiliated_company")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "affiliated_company",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>{isRequired("nit") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "nit",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.nit || ""}
                    onChange={(e) => handleInputChange(e, "nit")}
                    name={keysLoan.find((key) => key === "nit")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Monto solicitado</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("requested_amount")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "requested_amount",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.requested_amount || ""}
                    onChange={(e) => handleInputChange(e, "requested_amount")}
                    name={keysLoan.find((key) => key === "requested_amount")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Plazo (Meses)</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("deadline") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "deadline",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.deadline || undefined}
                    onChange={(e) => handleInputChange(e, "deadline")}
                    name={keysLoan.find((key) => key === "deadline")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Pago</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("payment") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "payment",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.payment || ""}
                    onChange={(e) => handleInputChange(e, "payment")}
                    name={keysLoan.find((key) => key === "payment")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("quota_value") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "quota_value",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.quota_value || ""}
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
            inputsComplete={sectionInputs({
              key: keysLoan02,
              formData: formData as ScalarLoanApplication,
            })}
            openBarStatus={openSecondPart}
          />
          {openSecondPart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Primer Apellido</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("firtLastName")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "firtLastName",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.firtLastName || ""}
                    onChange={(e) => handleInputChange(e, "firtLastName")}
                    name={keysLoan.find((key) => key === "firtLastName")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Segundo Apellido</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("secondLastName")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "secondLastName",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>{isRequired("names") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "names",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.names || ""}
                    onChange={(e) => handleInputChange(e, "names")}
                    name={keysLoan.find((key) => key === "names")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ocupacion, Oficio o Profesion</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("occupation") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "occupation",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("typeDocument")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "typeDocument",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.typeDocument || ""}
                    onChange={(e) => handleInputChange(e, "typeDocument")}
                    name={keysLoan.find((key) => key === "typeDocument")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
                    <option className={styles.optionSelect} value="CC">
                      C.C.
                    </option>
                    <option className={styles.optionSelect} value="CE">
                      C.E.
                    </option>
                    <option className={styles.optionSelect} value="PASAPORTE">
                      Pasaporte
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Numero de documento</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("numberDocument")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "numberDocument",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("persons_in_charge")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "persons_in_charge",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("birthDate") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "birthDate",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="date"
                    value={
                      formData && formData.birthDate instanceof Date
                        ? formData.birthDate.toLocaleDateString("es-ES")
                        : ""
                    }
                    onChange={(e) => handleInputChange(e, "birthDate")}
                    name={keysLoan.find((key) => key === "birthDate")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Lugar de nacimiento</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("place_birth") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "place_birth",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>{isRequired("genre") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "genre",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("marital_status")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "marital_status",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.marital_status || ""}
                    onChange={(e) => handleInputChange(e, "marital_status")}
                    name={keysLoan.find((key) => key === "marital_status")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
                    <option className={styles.optionSelect} value="Casado">
                      Casado
                    </option>
                    <option className={styles.optionSelect} value="Soltero">
                      Soltero
                    </option>
                    <option className={styles.optionSelect} value="Separado">
                      Separado
                    </option>
                    <option className={styles.optionSelect} value="Divorsiado">
                      Divorsiado
                    </option>
                    <option className={styles.optionSelect} value="Union_libre">
                      Union libre
                    </option>
                    <option className={styles.optionSelect} value="Viudo">
                      Viudo
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono / Celular</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("cellPhone") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "cellPhone",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("destination_resources")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "destination_resources",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("labor_seniority")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "labor_seniority",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("residence_address")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "residence_address",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>{isRequired("city") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "city",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("residence_phone")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "residence_phone",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("housing_type")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "housing_type",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.housing_type || ""}
                    onChange={(e) => handleInputChange(e, "housing_type")}
                    name={keysLoan.find((key) => key === "housing_type")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
                    <option className={styles.optionSelect} value="Propia">
                      Propia
                    </option>
                    <option className={styles.optionSelect} value="Familiar">
                      Familiar
                    </option>
                    <option className={styles.optionSelect} value="Arrendada">
                      Arrendada
                    </option>
                  </select>
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Email</p>
                    <div className={styles.infoInput}>
                      <p>{isRequired("email") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "email",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("vehicle") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "vehicle",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.vehicle || ""}
                    onChange={(e) => handleInputChange(e, "vehicle")}
                    name={keysLoan.find((key) => key === "vehicle")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
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
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("vehicleType")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "vehicleType",
                              });
                            }}
                          />
                        </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("whatsapp_number")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "whatsapp_number",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("pignorado") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "pignorado",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("in_favor_pignorado")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "in_favor_pignorado",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("commercial_value")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "commercial_value",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("other_income_other_principal")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "other_income_other_principal",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("other_personal_commercial_value")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "other_personal_commercial_value",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_members_in_company_agreement")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_members_in_company_agreement",
                            });
                          }}
                        />
                      </div>
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
                    <option value="" hidden disabled>
                      Selecciona una opcion
                    </option>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("is_currently_codebtor")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "is_currently_codebtor",
                            });
                          }}
                        />
                      </div>
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
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
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
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("codebtor_in_creditoya")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "codebtor_in_creditoya",
                              });
                            }}
                          />
                        </div>
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
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("codebtor_origin_creditoya")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "codebtor_origin_creditoya",
                              });
                            }}
                          />
                        </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("other_entity")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "other_entity",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.other_entity || ""}
                    onChange={(e) => handleInputChange(e, "other_entity")}
                    name={keysLoan.find((key) => key === "other_entity")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
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
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("codebtor_origin_creditoya")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "codebtor_origin_creditoya",
                              });
                            }}
                          />
                        </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("amount_in_the_other_entity")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "amount_in_the_other_entity",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("complete_name_spouse")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "complete_name_spouse",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("number_document_spouse")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "number_document_spouse",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("phone_spouse")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "phone_spouse",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("phone_company_spoue")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "phone_company_spoue",
                            });
                          }}
                        />
                      </div>
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
            inputsComplete={sectionInputs({
              key: keysLoan03,
              formData: formData as ScalarLoanApplication,
            })}
            openBarStatus={openThreePart}
          />
          {openThreePart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Numero de cuenta</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("bankNumberAccount")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "bankNumberAccount",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.bankNumberAccount || ""}
                    onChange={(e) => handleInputChange(e, "bankNumberAccount")}
                    name={keysLoan.find((key) => key === "bankNumberAccount")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Entidad</p>
                    <div className={styles.infoInput}>
                      <p>{isRequired("entity") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "entity",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.entity || ""}
                    onChange={(e) => handleInputChange(e, "entity")}
                    name={keysLoan.find((key) => key === "entity")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total ingresos mensuales</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("monthly_income")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "monthly_income",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("monthly_expenses")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "monthly_expenses",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("total_assets")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "total_assets",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("total_liabilities")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "total_liabilities",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("patrimony") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "patrimony",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("quota_value") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "quota_value",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>{isRequired("court") ? "Obligatorio" : "Opcional"}</p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "court",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("number_employees")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "number_employees",
                            });
                          }}
                        />
                      </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("other_income_other_principal")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "other_income_other_principal",
                            });
                          }}
                        />
                      </div>
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
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("which_other_income")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "which_other_income",
                              });
                            }}
                          />
                        </div>
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
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("monthly_income")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "monthly_income",
                            });
                          }}
                        />
                      </div>
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
            inputsComplete={sectionInputs({
              key: keysLoan04,
              formData: formData as ScalarLoanApplication,
            })}
            openBarStatus={openFourPart}
          />
          {openFourPart && (
            <>
              <div className={styles.containerInputs}>
                <h3>Personal</h3>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Apellidos y Nombres</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_name")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_name",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_name || ""}
                    onChange={(e) =>
                      handleInputChange(e, "personal_reference_name")
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_name"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Empresa donde trabaja</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_work_company_name")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_work_company_name",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_work_company_name || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "personal_reference_work_company_name"
                      )
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_work_company_name"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ciudad</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_city")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_city",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_city || ""}
                    onChange={(e) =>
                      handleInputChange(e, "personal_reference_city")
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_city"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Direccion residencia</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_address")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_address",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_address || ""}
                    onChange={(e) =>
                      handleInputChange(e, "personal_reference_address")
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_address"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono Residencia</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_number_residence")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_number_residence",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_number_residence || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "personal_reference_number_residence"
                      )
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_number_residence"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono celular</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("personal_reference_number_phone")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "personal_reference_number_phone",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.personal_reference_number_phone}
                    onChange={(e) =>
                      handleInputChange(e, "personal_reference_number_phone")
                    }
                    name={keysLoan.find(
                      (key) => key === "personal_reference_number_phone"
                    )}
                  />
                </div>

                <h3>Familiar</h3>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Apellidos y Nombres</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_name")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_name",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_name || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_name")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_name"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Empresa donde trabaja</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_work_company_name")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_work_company_name",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_work_company_name || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_work_company_name")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_work_company_name"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Ciudad</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_city")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_city",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_city || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_city")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_city"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Direccion residencia</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_address")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_address",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_address || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_address")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_address"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono Residencia</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_number_residence")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_number_residence",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_number_residence || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_number_residence")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_number_residence"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Telefono celular</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("family_reference_number_phone")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "family_reference_number_phone",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.family_reference_number_phone || ""}
                    onChange={(e) =>
                      handleInputChange(e, "family_reference_number_phone")
                    }
                    name={keysLoan.find(
                      (key) => key === "family_reference_number_phone"
                    )}
                  />
                </div>
              </div>
            </>
          )}

          <BarParts
            titleBar={"Indique la clase de contrato"}
            openBar={() => setOpenFivePart(!openFivePart)}
            inputsComplete={sectionInputs({
              key: keysLoan05,
              formData: formData as ScalarLoanApplication,
            })}
            openBarStatus={openFivePart}
          />
          {openFivePart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Termino fijo</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("fixed_term") ? "Obligatorio" : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "fixed_term",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.fixed_term || ""}
                    onChange={(e) => handleInputChange(e, "fixed_term")}
                    name={keysLoan.find((key) => key === "fixed_term")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
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
                    <p>Labor o Obra</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("labor_or_work")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "labor_or_work",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <select
                    className={styles.boxSelect}
                    value={formData?.labor_or_work || ""}
                    onChange={(e) => handleInputChange(e, "labor_or_work")}
                    name={keysLoan.find((key) => key === "labor_or_work")}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opcion
                    </option>
                    <option className={styles.optionSelect} value="Si">
                      No
                    </option>
                    <option className={styles.optionSelect} value="No">
                      Si
                    </option>
                  </select>
                </div>
              </div>
            </>
          )}

          <BarParts
            titleBar={"Datos del contrato"}
            openBar={() => setOpenSixPart(!openSixPart)}
            inputsComplete={sectionInputs({
              key: keysLoan06,
              formData: formData as ScalarLoanApplication,
            })}
            openBarStatus={openSixPart}
          />
          {openSixPart && (
            <>
              <div className={styles.containerInputs}>
                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Fecha de vinculacion</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("date_relationship")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "date_relationship",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="date"
                    value={
                      formData?.date_relationship instanceof Date
                        ? formData.date_relationship.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleInputChange(e, "date_relationship")}
                    name={keysLoan.find((key) => key === "date_relationship")}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Antiguedad laboral (Suma tiempo contratos)</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("labor_seniority_contracts")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "labor_seniority_contracts",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.labor_seniority_contracts || ""}
                    onChange={(e) =>
                      handleInputChange(e, "labor_seniority_contracts")
                    }
                    name={keysLoan.find(
                      (key) => key === "labor_seniority_contracts"
                    )}
                  />
                </div>

                {formData?.fixed_term == "Si" && (
                  <div className={styles.boxInput}>
                    <div className={styles.headerInputInfo}>
                      <p>Fecha fin contrato actual</p>
                      <div className={styles.infoInput}>
                        <p>
                          {isRequired("requested_amount")
                            ? "Obligatorio"
                            : "Opcional"}
                        </p>
                        <div className={styles.boxIconInfo}>
                          <TbInfoCircle
                            size={20}
                            className={styles.iconInfo}
                            onClick={() => {
                              handleOpenModel();
                              handleInfoInput({
                                option: "requested_amount",
                              });
                            }}
                          />
                        </div>
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
                )}

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Promedio salario variable mensual</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("average_variable_salary")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "average_variable_salary",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.average_variable_salary}
                    onChange={(e) =>
                      handleInputChange(e, "average_variable_salary")
                    }
                    name={keysLoan.find(
                      (key) => key === "average_variable_salary"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Total ingreso Mensual</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("total_monthly_income")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "total_monthly_income",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.total_monthly_income}
                    onChange={(e) =>
                      handleInputChange(e, "total_monthly_income")
                    }
                    name={keysLoan.find(
                      (key) => key === "total_monthly_income"
                    )}
                  />
                </div>

                <div className={styles.boxInput}>
                  <div className={styles.headerInputInfo}>
                    <p>Descuentos mensuales</p>
                    <div className={styles.infoInput}>
                      <p>
                        {isRequired("monthly_discounts")
                          ? "Obligatorio"
                          : "Opcional"}
                      </p>
                      <div className={styles.boxIconInfo}>
                        <TbInfoCircle
                          size={20}
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModel();
                            handleInfoInput({
                              option: "monthly_discounts",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    className={styles.inputInfo}
                    type="text"
                    value={formData?.monthly_discounts || ""}
                    onChange={(e) => handleInputChange(e, "monthly_discounts")}
                    name={keysLoan.find((key) => key === "monthly_discounts")}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {sectionInputs({
          key: keysLoan,
          formData: formData as ScalarLoanApplication,
        }) && (
          <>
            <div className={styles.containerBtnSoli}>
              <button className={styles.btnSoli} onClick={handleSubmit}>
                Solicitar
              </button>
            </div>
          </>
        )}
      </main>

      <Modal isOpen={openInfo} onClose={handleOpenModel}>
        {infoModel}
      </Modal>
    </>
  );
}

export default Contract;
