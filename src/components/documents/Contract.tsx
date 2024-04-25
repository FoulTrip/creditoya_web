"use client";

import React, { use, useEffect, useState } from "react";
import styles from "./Contract.module.css";
import Modal from "../modal/Modal";
import PreEnvio from "./PreEnvio";
import { useGlobalContext } from "@/context/Auth";

import JsonBasePDF from "@/components/Jsons/PrestamoCarta.json";
import axios from "axios";
import { ScalarDocument, ScalarLoanApplication } from "@/types/User";

function Contract({ toggleContract }: { toggleContract: () => void }) {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [successVerify, setSuccessVerify] = useState<boolean>(false);
  const [docPreview, setDocPreview] = useState<ScalarDocument | null>(null);
  const [formData, setFormData] = useState<{
    numeroCuenta: string;
    entidad: string;
    tipoCuenta: string;
    origin: string;
  }>({
    // Aquí se definen los valores iniciales para el JSON
    numeroCuenta: "",
    entidad: "",
    tipoCuenta: "",
    origin: "",
    // Añade más campos según sea necesario
  });

  const { user } = useGlobalContext();

  // console.log(formData.origin);

  useEffect(() => {
    const getDocsPreview = async () => {
      const response = await axios.post(
        "/api/user/doc_id",
        {
          userId: user?.id,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      // console.log(response.data);
      setDocPreview(response.data.data as ScalarDocument);
    };

    getDocsPreview();
  }, [user?.id, user?.token]);

  const handleStatusVerify = async () => {
    setSuccessVerify(true);
    setOpenModel(false);

    // Crear una copia del JSON original
    const modifiedJson = { ...JsonBasePDF };

    // console.log("Base Json", JsonBasePDF);
    // console.log("copy of zero: ", modifiedJson);

    // Llenar los campos correspondientes con los datos recopilados de los inputs
    modifiedJson.optionAccount[0].numberAccount = formData.numeroCuenta;
    modifiedJson.optionAccount[0].entityAccount = formData.entidad;
    modifiedJson.justifyUser = formData.origin;

    // Si se selecciona cuenta corriente, cambiar select a true
    if (formData.tipoCuenta === "Cuenta Corriente") {
      modifiedJson.optionAccount[0].typeAccount[0].select = true;
    } else if (formData.tipoCuenta === "cuenta ahorros") {
      modifiedJson.optionAccount[0].typeAccount[1].select = true;
    }

    // // Imprimir el JSON modificado en la consola
    // console.log("finalModified: ", modifiedJson);

    const data: ScalarLoanApplication = {
      userId: user?.id as string,
      bankCurrentAccount: modifiedJson.optionAccount[0].typeAccount[0].select,
      bankSavingAccount: modifiedJson.optionAccount[0].typeAccount[1].select,
      bankNumberAccount: modifiedJson.optionAccount[0].numberAccount,
      entity: modifiedJson.optionAccount[0].entityAccount,
      fundsOrigin: modifiedJson.justifyUser,
      ccNumber: docPreview?.number as string,
    };

    console.log(data);

    const response = await axios.post("/api/contract/create", data, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    console.log(response);

    toggleContract();

    // const responseSendOwn = await axios.post("/api/mail/contract_own", {
    //   addressee: user?.email,
    // });
  };

  const handleTipoCuentaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Actualizar el estado con el valor seleccionado por el usuario para el tipo de cuenta
    setFormData({
      ...formData,
      tipoCuenta: event.target.value,
    });
  };

  const handleNumeroCuentaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Actualizar el estado con el número de cuenta ingresado por el usuario
    setFormData({
      ...formData,
      numeroCuenta: event.target.value,
    });
  };

  const handleEntidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Actualizar el estado con la entidad ingresada por el usuario
    setFormData({
      ...formData,
      entidad: event.target.value,
    });
  };

  const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Actualizar el estado con la justificación ingresada por el usuario
    setFormData({
      ...formData,
      origin: event.target.value,
    });
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.headerCard}>
          <h2 className={styles.firstTitle}>{JsonBasePDF.headerTitle}</h2>
          <h4 onClick={toggleContract}>Cancelar</h4>
        </div>
        <p className={styles.groupText}>{JsonBasePDF.firstExplainText}</p>
        <h3 className={styles.secondTitle}>{JsonBasePDF.secondTitle}</h3>
        <div className={styles.barDates}>
          <div className={styles.boxTypeAccount}>
            <div className={styles.centerBoxTypeAccount}>
              {JsonBasePDF.optionAccount.map((opts) =>
                opts.typeAccount.map((type) => (
                  <div className={styles.supraCenterTA} key={type.name}>
                    <p>{type.name}</p>
                    <input
                      type="radio"
                      name="tipoCuenta"
                      value="Cuenta Corriente"
                      onChange={handleTipoCuentaChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.boxDate}>
            <p>Nro. Cuenta</p>
            <input
              type="text"
              value={formData.numeroCuenta}
              onChange={handleNumeroCuentaChange}
            />
          </div>

          <div className={styles.boxDate}>
            <p>Entidad</p>
            <input
              type="text"
              value={formData.entidad}
              onChange={handleEntidadChange}
            />
          </div>
        </div>
        <h3 className={styles.threeTitle}>{JsonBasePDF.threeTitle}</h3>
        <p className={styles.justification}>{JsonBasePDF.justifyText}</p>
        <input
          className={styles.textJustification}
          value={formData.origin}
          onChange={handleOriginChange}
        />
        <p className={styles.threBoxTexts}>
          <span className={styles.threBoxTxextsNumber}>
            {JsonBasePDF.numberOnce}
          </span>
          {JsonBasePDF.textOnce}
        </p>
        <h3 className={styles.fourTitle}>{JsonBasePDF.finalTitle}</h3>
        <p className={styles.finalText}>{JsonBasePDF.subFinalText}</p>
        <p className={styles.finalText}>{JsonBasePDF.finalText}</p>

        <div>
          <button onClick={() => setOpenModel(true)}>
            Completar Solicitud
          </button>
        </div>

        {openModel == true && (
          <Modal isOpen onClose={() => setOpenModel(false)}>
            <PreEnvio
              email={user?.email as string}
              name={user?.name as string}
              Success={() => handleStatusVerify()}
              token={user?.token as string}
            />
          </Modal>
        )}

        {successVerify && <p>Envio verificado</p>}
      </div>
    </>
  );
}

export default Contract;
