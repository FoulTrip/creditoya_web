"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./Contract.module.css";
import { useDropzone } from "react-dropzone";
import {
  TbCircleCheckFilled,
  TbInfoCircle,
  TbLoader,
  TbTrash,
  TbX,
} from "react-icons/tb";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import { toast } from "sonner";
import {
  ScalarDocument,
  ScalarLoanApplication,
  ScalarUser,
} from "@/types/User";
import CurrencyInput from "react-currency-input-field";
import SelectBanks from "../accesories/SelectBanks";

import { CiMoneyCheck1 } from "react-icons/ci";
import Modal from "../modal/Modal";
import PreEnvio from "./PreEnvio";
import { useWebSocket } from "next-ws/client";
import LoadingPage from "../Loaders/LoadingPage";
import Signature from "./signature";
import ListPdfsAutogenerate from "./ListPdfsAutogenerate";

function Contract({
  userId,
  toggleContract,
  success,
}: {
  userId: string;
  toggleContract: () => void;
  success?: (data: ScalarLoanApplication[]) => void;
}) {
  const { user } = useGlobalContext();
  const ws = useWebSocket();

  const [creatingLoan, setCreatingLoan] = useState(false);

  const [dataContract, setDataContract] =
    useState<ScalarLoanApplication | null>(null);

  const [userInfo, setUserInfo] = useState<ScalarUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [imagePreview3, setImagePreview3] = useState("No definido");
  const [imagePreview4, setImagePreview4] = useState("No definido");
  const [imagePreview5, setImagePreview5] = useState("No definido");
  const [imagePreview6, setImagePreview6] = useState("No definido");

  const [nameFile01, setNameFile01] = useState<string | null>(null);
  const [nameFile02, setNameFile02] = useState<string | null>(null);
  const [nameFile03, setNameFile03] = useState<string | null>(null);
  const [nameFile04, setNameFile04] = useState<string | null>(null);

  const [successSignature, setSuccessSignature] = useState<boolean>(false);

  const [link, setLink] = useState<string>();

  const [loadingProccessImg03, setLoadingProccessImg03] =
    useState<boolean>(false);
  const [loadingProccessImg04, setLoadingProccessImg04] =
    useState<boolean>(false);
  const [loadingProccessImg05, setLoadingProccessImg05] =
    useState<boolean>(false);
  const [loadingProccessImg06, setLoadingProccessImg06] =
    useState<boolean>(false);

  const [openViewPdf, setOpenViewPdf] = useState<boolean>(false);
  const [openTerms, setOpenTerms] = useState<boolean>(false);
  const [openPreSend, setOpenPreSend] = useState<boolean>(false);

  const [firstFlayer, setFirstFlayer] = useState<FormData | null>(null);
  const [secondFlayer, setSecondFlayer] = useState<FormData | null>(null);
  const [threeFlayer, setThreeFlayer] = useState<FormData | null>(null);
  const [laborCard, setLaborCard] = useState<FormData | null>(null);
  const [signatureSrc, setSignatureSrc] = useState<FormData | null>(null);

  const [openWarnBanner, setOpenWarnBanner] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getInfoUserDocs = async () => {
      try {
        if (user && user.token) {
          const response = await axios.post(
            "/api/user/list_docs",
            {
              userId: userId,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          // console.log(response.data);
          if (response.data && response.data.data && response.data.data[0]) {
            const data: ScalarDocument = response.data.data[0];
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          console.log(error.cause);
        }
      }
    };

    getInfoUserDocs();
  }, [userId, user, user?.token]);

  useEffect(() => {
    setLoading(true);
    const getInfoUser = async () => {
      try {
        if (user && user.token) {
          const response = await axios.post(
            "/api/user/id",
            {
              userId: user && user.id,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          // console.log(response);
          const data: ScalarUser = response.data.data;
          // console.log(data);
          setUserInfo(data);
          setDataContract((prevDataContract) => ({
            ...(prevDataContract as ScalarLoanApplication),
            userId: data.id as string,
          }));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getInfoUser();
  }, [userId, user, user?.token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof ScalarLoanApplication
  ) => {
    const { value } = e.target;

    setDataContract((prevFormData) => ({
      ...(prevFormData as ScalarLoanApplication),
      [key]: value,
    }));
  };

  const handleOpenPreSend = () => {
    try {
      if (dataContract) {
        if (dataContract.bankSavingAccount == false)
          throw new Error("Eligue tu tipo de cuenta");
        if (!dataContract.cantity)
          throw new Error("Ingresa la cantidad a solicitar");
        if (!dataContract.entity)
          throw new Error("Selecciona tu entidad bancaria");
        if (!imagePreview4 && !imagePreview5 && !imagePreview6)
          throw new Error("Volantes de pago incompletos");
        if (!imagePreview3)
          throw new Error("Sube tu carta laboral actualizada");
        if (!dataContract.terms_and_conditions)
          throw new Error("Acepta los terminos y condiciones");
        if (!dataContract.signature) throw new Error("Firma tu solicitud");

        setOpenPreSend(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.warning(error.message);
      }
    }
  };

  const handlerOpenModel = ({ link }: { link: string }) => {
    setOpenViewPdf(true);
    setLink(link);
  };

  const handleCloseModel = () => {
    setOpenViewPdf(false);
  };

  const handleAcceptTerms = () => {
    setDataContract((prevDataContract) => ({
      ...(prevDataContract as ScalarLoanApplication),
      terms_and_conditions: true,
    }));
  };

  const handleDeleteDoc = async (file: number) => {
    try {
      if (file === 0) {
        const response = await axios.post("/api/temp/files/delete", {
          nameFile: nameFile01,
        });

        if (response.data.success) {
          console.log(response.data.message);
          setImagePreview4("No definido");
          toast.success("Archivo eliminado exitosamente");
        } else {
          console.error(response.data.error);
        }
      } else if (file === 1) {
        const response = await axios.post("/api/temp/files/delete", {
          nameFile: nameFile02,
        });

        if (response.data.success) {
          console.log(response.data.message);
          setImagePreview5("No definido");
          toast.success("Archivo eliminado exitosamente");
        } else {
          console.error(response.data.error);
        }
      } else if (file === 2) {
        const response = await axios.post("/api/temp/files/delete", {
          nameFile: nameFile03,
        });

        if (response.data.success) {
          console.log(response.data.message);
          setImagePreview6("No definido");
          toast.success("Archivo eliminado exitosamente");
        } else {
          console.error(response.data.error);
        }
      } else if (file === 3) {
        const response = await axios.post("/api/temp/files/delete", {
          nameFile: nameFile04,
        });

        if (response.data.success) {
          console.log(response.data.message);
          setImagePreview3("No definido");
          toast.success("Archivo eliminado exitosamente");
        } else {
          console.error(response.data.error);
        }
      }
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const handleAuthLoan = async () => {
    try {
      setOpenPreSend(false);
      setCreatingLoan(true);

      if (firstFlayer === null) throw new Error("Falta primer volante");
      if (secondFlayer === null) throw new Error("Falta segundo volante");
      if (threeFlayer === null) throw new Error("Falta tercer volante");
      if (laborCard === null) throw new Error("Falta cuarto volante");
      if (signatureSrc === null) throw new Error("Falta tu firma");

      const formArrays = [
        firstFlayer,
        secondFlayer,
        threeFlayer,
        laborCard,
        signatureSrc,
      ];

      const addFirstFlayer = await axios.post(
        "/api/upload/google/create",
        firstFlayer,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      const addSecondFlayer = await axios.post(
        "/api/upload/google/create",
        secondFlayer,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      const addThreeFlayer = await axios.post(
        "/api/upload/google/create",
        threeFlayer,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      const addLaborCard = await axios.post(
        "/api/upload/google/create",
        laborCard,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      const addSignature = await axios.post(
        "/api/upload/signature",
        {
          img: signatureSrc.get("img"),
          userId,
          upSignatureId: signatureSrc.get("upSignatureId"),
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // Eliminación de archivos temporales
      for (const formData of formArrays) {
        const nameDoc = formData.get("name") || formData.get("img");
        if (nameDoc) {
          await axios.post("/api/temp/files/delete", {
            nameFile: nameDoc,
          });
        }
      }

      const response = await axios.post(
        "/api/loan/create",
        {
          loanData: {
            ...dataContract,
            fisrt_flyer: addFirstFlayer.data.data.link,
            second_flyer: addSecondFlayer.data.data.link,
            third_flyer: addThreeFlayer.data.data.link,
            labor_card: addLaborCard.data.data.link,
            signature: addSignature.data.data,
            upSignatureId: signatureSrc.get("upSignatureId"),
          },
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.success == true) {
        const data: ScalarLoanApplication = response.data.data;

        const send = await axios.post(
          "/api/mail/new_loan",
          {
            name: `${userInfo?.names} ${userInfo?.firstLastName} ${userInfo?.secondLastName}`,
            addressee: userInfo?.email as string,
            loanId: data?.id,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        if (send.data.success == true) {
          ws?.send(
            JSON.stringify({
              type: "new_loan",
              owner: user?.id,
            })
          );

          const allLoans = await axios.post(
            "/api/user/loans",
            {
              userId,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );

          if (allLoans.data.success) {
            const data: ScalarLoanApplication[] = allLoans.data.data;

            success && success(data);
            toggleContract();
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la solicitud");
    }
  };

  const handleSaveSignature = (
    signatureUrl: string,
    upSignatureId: string,
    base64: string
  ) => {
    const signFormData = new FormData();
    signFormData.append("img", base64);
    signFormData.append("upSignatureId", upSignatureId);
    signFormData.append("userId", userId);
    setDataContract((prevFormData) => ({
      ...(prevFormData as ScalarLoanApplication),
      signature: signatureUrl,
    }));
    setSignatureSrc(signFormData);
  };

  const handleSuccessSignature = () => {
    setSuccessSignature(!successSignature);
  };

  const handleOptionBank = (option: string) => {
    setDataContract((prevDataContract) => ({
      ...(prevDataContract as ScalarLoanApplication),
      entity: option,
    }));
  };

  const onDrop3 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoadingProccessImg03(true);
        const file = acceptedFiles[0];

        const allowedExtensions = ["application/pdf"];
        if (!allowedExtensions.includes(file.type)) {
          setLoadingProccessImg03(false);
          toast.error("El archivo debe ser un PDF");
          throw new Error("El archivo debe ser un PDF");
        }

        const maxSize = 2.5 * 1024 * 1024; // 2.5MB en bytes

        if (file.size > maxSize) {
          throw new Error("El archivo debe pesar menos de 2.5MB");
        }

        const formData = new FormData();
        const nameFile = "labor_card";
        formData.append("file", file);
        formData.append("name", nameFile);
        if (user) formData.append("userId", user.id as string);
        setNameFile04(nameFile);

        const tempLink = await axios.post("/api/temp/files/create", formData);

        if (tempLink.data.success == true) {
          const link = tempLink.data.data;
          setLaborCard(formData);
          setLoadingProccessImg03(false);
          toast.success("Archivo cargado exitosamente");
          setImagePreview3(link);
        }
      }
    },
    [user]
  );

  const onDrop4 = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (acceptedFiles.length > 0) {
          setLoadingProccessImg04(true);
          const file = acceptedFiles[0];

          const allowedExtensions = ["application/pdf"];
          if (!allowedExtensions.includes(file.type)) {
            setLoadingProccessImg04(false);
            toast.error("El archivo debe ser un PDF");
            throw new Error("El archivo debe ser un PDF");
          }

          const maxSize = 2.5 * 1024 * 1024; // 2.5MB en bytes

          if (file.size > maxSize) {
            throw new Error("El archivo debe pesar menos de 2.5MB");
          }

          const formData = new FormData();
          const nameFile = "paid_flyer_01";
          formData.append("file", file);
          formData.append("name", nameFile);
          setNameFile01(nameFile);
          if (user) formData.append("userId", user.id as string);

          const tempLink = await axios.post("/api/temp/files/create", formData);

          if (tempLink.data.success == true) {
            const link = tempLink.data.data;
            console.log(link);
            setFirstFlayer(formData);
            setLoadingProccessImg04(false);
            toast.success("Archivo cargado exitosamente");
            setImagePreview4(link);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
    [user]
  );

  const onDrop5 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoadingProccessImg05(true);
        const file = acceptedFiles[0];

        const allowedExtensions = ["application/pdf"];
        if (!allowedExtensions.includes(file.type)) {
          setLoadingProccessImg05(false);
          toast.error("El archivo debe ser un PDF");
          throw new Error("El archivo debe ser un PDF");
        }

        const maxSize = 2.5 * 1024 * 1024; // 2.5MB en bytes

        if (file.size > maxSize) {
          throw new Error("El archivo debe pesar menos de 2.5MB");
        }

        const formData = new FormData();
        const nameFile = "paid_flyer_02";
        formData.append("file", file);
        formData.append("name", nameFile);
        setNameFile02(nameFile);
        if (user) formData.append("userId", user.id as string);

        const tempLink = await axios.post("/api/temp/files/create", formData);

        if (tempLink.data.success == true) {
          const link = tempLink.data.data;
          console.log(link);
          setSecondFlayer(formData);
          toast.success("Archivo cargado exitosamente");
          setLoadingProccessImg05(false);
          setImagePreview5(link);
        }
      }
    },
    [user]
  );

  const onDrop6 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoadingProccessImg06(true);
        const file = acceptedFiles[0];

        const allowedExtensions = ["application/pdf"];
        if (!allowedExtensions.includes(file.type)) {
          setLoadingProccessImg03(false);
          toast.error("El archivo debe ser un PDF");
          throw new Error("El archivo debe ser un PDF");
        }

        const maxSize = 2.5 * 1024 * 1024; // 2.5MB en bytes

        if (file.size > maxSize) {
          throw new Error("El archivo debe pesar menos de 2.5MB");
        }

        const formData = new FormData();
        const nameFile = "paid_flyer_03";
        formData.append("file", file);
        formData.append("name", nameFile);
        setNameFile03(nameFile);
        if (user) formData.append("userId", user.id as string);

        const tempLink = await axios.post("/api/temp/files/create", formData);

        if (tempLink.data.success == true) {
          const link = tempLink.data.data;
          console.log(link);
          setThreeFlayer(formData);
          toast.success("Archivo cargado exitosamente");
          setLoadingProccessImg06(false);
          setImagePreview6(link);
        }
      }
    },
    [user]
  );

  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } =
    useDropzone({ onDrop: onDrop3 });

  const { getRootProps: getRootProps4, getInputProps: getInputProps4 } =
    useDropzone({ onDrop: onDrop4 });

  const { getRootProps: getRootProps5, getInputProps: getInputProps5 } =
    useDropzone({ onDrop: onDrop5 });

  const { getRootProps: getRootProps6, getInputProps: getInputProps6 } =
    useDropzone({ onDrop: onDrop6 });

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      {openWarnBanner && (
        <div className={styles.bannerWarn}>
          <div className={styles.boxInfoText}>
            <div className={styles.boxIconInfo}>
              <TbInfoCircle className={styles.iconInfo} />
            </div>
            <p className={styles.textInfo}>
              Porfavor contenga los documentos requeridos en los archivos de su
              telefono antes empezar a llenar la solicitud de prestamo
            </p>
          </div>
          <div
            className={styles.boxIconX}
            onClick={() => setOpenWarnBanner(false)}
          >
            <TbX className={styles.iconX} size={20} />
          </div>
        </div>
      )}

      {creatingLoan == false && (
        <>
          <div className={styles.btnClose}>
            <p onClick={toggleContract}>Cancelar</p>
          </div>

          <div className={styles.ContractContainer}>
            <div className={styles.partBox}>
              <div className={styles.partSelect}>
                <SelectBanks select={handleOptionBank} />
              </div>

              <div className={styles.accountInput}>
                <h5>Numero de cuenta</h5>
                <input
                  type="text"
                  onChange={(e) => handleInputChange(e, "bankNumberAccount")}
                />
              </div>

              <div className={styles.partPrice}>
                <h5>Valor solicitud</h5>
                <CurrencyInput
                  className={styles.inputPrice}
                  placeholder="Ingresa la cantidad"
                  defaultValue={0}
                  decimalsLimit={2}
                  onValueChange={(value, name, values) => {
                    setDataContract((prevDataContract) => ({
                      ...(prevDataContract as ScalarLoanApplication),
                      cantity: value as string,
                    }));
                  }}
                  prefix="$"
                />
              </div>

              <div>
                <h3 className={styles.titleVolants}>
                  Tres ultimos volantes de pago
                </h3>
                <div className={styles.columnCards}>
                  <div
                    className={
                      imagePreview4 === "No definido"
                        ? styles.boxInfoPay
                        : styles.boxInfoPayActive
                    }
                    {...(imagePreview4 === "No definido"
                      ? getRootProps4()
                      : {})}
                  >
                    {imagePreview4 === "No definido" && (
                      <input {...getInputProps4()} />
                    )}
                    {imagePreview4 && imagePreview4 != "No definido" ? (
                      <>
                        <div className={styles.supraBarStatus}>
                          <div className={styles.barStatusDocs}>
                            <div className={styles.headerCardStatus}>
                              <div className={styles.boxIconStatus}>
                                <TbCircleCheckFilled
                                  className={styles.iconCheck}
                                />
                              </div>
                              <p className={styles.warninCC}>
                                Primer volante de pago
                              </p>
                            </div>
                          </div>

                          <div className={styles.optionsBox}>
                            <div className={styles.boxIconsStatus}>
                              <div
                                className={styles.boxIcon}
                                onClick={() => handleDeleteDoc(0)}
                              >
                                <TbTrash
                                  className={styles.trashIcon}
                                  size={20}
                                />
                              </div>
                            </div>

                            <button
                              className={styles.btnOpenDoc}
                              onClick={() =>
                                handlerOpenModel({
                                  link: imagePreview4,
                                })
                              }
                            >
                              Revisar
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.containerDropDocuments}>
                        <div className={styles.boxIconPreview}>
                          <CiMoneyCheck1
                            className={styles.iconPreview}
                            size={60}
                          />
                        </div>
                        <p className={styles.textPreview}>
                          {loadingProccessImg04 && "Procesando tu volante..."}
                          {!loadingProccessImg04 &&
                            "Subir primer volante de pago"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      imagePreview5 === "No definido"
                        ? styles.boxInfoPay
                        : styles.boxInfoPayActive
                    }
                    {...(imagePreview5 === "No definido"
                      ? getRootProps5()
                      : {})}
                  >
                    {imagePreview5 === "No definido" && (
                      <input {...getInputProps5()} />
                    )}
                    {imagePreview5 && imagePreview5 != "No definido" ? (
                      <>
                        <div className={styles.supraBarStatus}>
                          <div className={styles.barStatusDocs}>
                            <div className={styles.headerCardStatus}>
                              <div className={styles.boxIconStatus}>
                                <TbCircleCheckFilled
                                  className={styles.iconCheck}
                                />
                              </div>
                              <p className={styles.warninCC}>
                                Segundo volante de pago
                              </p>
                            </div>
                          </div>

                          <div className={styles.optionsBox}>
                            <div className={styles.boxIconsStatus}>
                              <div
                                className={styles.boxIcon}
                                onClick={() => handleDeleteDoc(1)}
                              >
                                <TbTrash
                                  className={styles.trashIcon}
                                  size={20}
                                />
                              </div>
                            </div>

                            <button
                              className={styles.btnOpenDoc}
                              onClick={() =>
                                handlerOpenModel({
                                  link: imagePreview5,
                                })
                              }
                            >
                              Revisar
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.containerDropDocuments}>
                        <div className={styles.boxIconPreview}>
                          <CiMoneyCheck1
                            className={styles.iconPreview}
                            size={60}
                          />
                        </div>
                        <p className={styles.textPreview}>
                          {loadingProccessImg05 && "Procesando tu volante..."}
                          {!loadingProccessImg05 &&
                            "Subir segundo volante de pago"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      imagePreview6 === "No definido"
                        ? styles.boxInfoPay
                        : styles.boxInfoPayActive
                    }
                    {...(imagePreview6 === "No definido"
                      ? getRootProps6()
                      : {})}
                  >
                    {imagePreview6 === "No definido" && (
                      <input {...getInputProps6()} />
                    )}
                    {imagePreview6 && imagePreview6 != "No definido" ? (
                      <>
                        <div className={styles.supraBarStatus}>
                          <div className={styles.barStatusDocs}>
                            <div className={styles.headerCardStatus}>
                              <div className={styles.boxIconStatus}>
                                <TbCircleCheckFilled
                                  className={styles.iconCheck}
                                />
                              </div>
                              <p className={styles.warninCC}>
                                Tercer volante de pago
                              </p>
                            </div>
                          </div>

                          <div className={styles.optionsBox}>
                            <div className={styles.boxIconsStatus}>
                              <div
                                className={styles.boxIcon}
                                onClick={() => handleDeleteDoc(2)}
                              >
                                <TbTrash
                                  className={styles.trashIcon}
                                  size={20}
                                />
                              </div>
                            </div>

                            <button
                              className={styles.btnOpenDoc}
                              onClick={() =>
                                handlerOpenModel({
                                  link: imagePreview6,
                                })
                              }
                            >
                              Revisar
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.containerDropDocuments}>
                        <div className={styles.boxIconPreview}>
                          <CiMoneyCheck1
                            className={styles.iconPreview}
                            size={60}
                          />
                        </div>
                        <p className={styles.textPreview}>
                          {loadingProccessImg06 && "Procesando tu volante..."}
                          {!loadingProccessImg06 &&
                            "Subir tercer volante de pago"}
                        </p>
                      </div>
                    )}
                  </div>

                  <h3 className={styles.titleVolantsCard}>
                    Carta laboral actualizada
                  </h3>

                  <div
                    className={
                      imagePreview3 === "No definido"
                        ? styles.boxInfoPay
                        : styles.boxInfoPayActive
                    }
                    {...(imagePreview3 === "No definido"
                      ? getRootProps3()
                      : {})}
                  >
                    {imagePreview3 === "No definido" && (
                      <input {...getInputProps3()} />
                    )}
                    {imagePreview3 && imagePreview3 != "No definido" ? (
                      <>
                        <div className={styles.supraBarStatus}>
                          <div className={styles.barStatusDocs}>
                            <div className={styles.headerCardStatus}>
                              <div className={styles.boxIconStatus}>
                                <TbCircleCheckFilled
                                  className={styles.iconCheck}
                                />
                              </div>
                              <p className={styles.warninCC}>Carta Laboral</p>
                            </div>
                          </div>

                          <div className={styles.optionsBox}>
                            <div className={styles.boxIconsStatus}>
                              <div
                                className={styles.boxIcon}
                                onClick={() => handleDeleteDoc(3)}
                              >
                                <TbTrash
                                  className={styles.trashIcon}
                                  size={20}
                                />
                              </div>
                            </div>

                            <button
                              className={styles.btnOpenDoc}
                              onClick={() =>
                                handlerOpenModel({
                                  link: imagePreview3,
                                })
                              }
                            >
                              Revisar
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.containerDropDocuments}>
                        <div className={styles.boxIconPreview}>
                          <CiMoneyCheck1
                            className={styles.iconPreview}
                            size={60}
                          />
                        </div>
                        <p className={styles.textPreview}>
                          {loadingProccessImg03 &&
                            "Procesando tu carta laboral..."}
                          {!loadingProccessImg03 && "Subir carta laboral"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className={styles.titleVolantsSignal}>Firma tu solicitud</h3>

          <Signature
            success={handleSuccessSignature}
            src={handleSaveSignature}
            userId={userId}
          />

          {successSignature && (
            <>
              <ListPdfsAutogenerate
                data={dataContract as ScalarLoanApplication}
              />
            </>
          )}

          <div className={styles.boxTerms}>
            <div className={styles.centerBoxTerms}>
              <input type="checkbox" onChange={handleAcceptTerms} />
              <h5>
                Aceptar{" "}
                <span
                  className={styles.linkTerms}
                  onClick={() => setOpenTerms(true)}
                >
                  terminos y condiciones
                </span>
              </h5>
            </div>
          </div>

          <div className={styles.finalBtnCreate}>
            <button onClick={handleOpenPreSend}>Solicitar</button>
          </div>

          <Modal
            isOpen={openViewPdf}
            onClose={handleCloseModel}
            link={link as string}
          >
            <p>hola</p>
          </Modal>

          <Modal isOpen={openPreSend} onClose={handleAuthLoan} link={null}>
            <PreEnvio
              data={dataContract as ScalarLoanApplication}
              Success={handleAuthLoan}
              token={user?.token as string}
              completeName={`${userInfo?.names} ${userInfo?.firstLastName} ${userInfo?.secondLastName}`}
              mail={userInfo?.email as string}
            />
          </Modal>

          <Modal
            isOpen={openTerms}
            onClose={() => setOpenTerms(false)}
            link={null}
          >
            <div className={styles.componentTerms}>
              <h3>Terminos y condiciones</h3>
              <div className={styles.centerCoponentsTerms}>
                <div className={styles.boxCharc}>
                  <div className={styles.boxIconChecking}>
                    <TbCircleCheckFilled
                      size={20}
                      className={styles.iconChecking}
                    />
                  </div>
                  <h5>Firma digital de los Documentos:</h5>
                </div>
                <ul>
                  <li style={{ textAlign: "start", fontSize: "14px" }}>
                    Autorizacion centrales de riesgo
                  </li>
                </ul>

                <ul>
                  <li style={{ textAlign: "start", fontSize: "14px" }}>
                    Carta instrucciones
                  </li>
                </ul>

                <ul>
                  <li style={{ textAlign: "start", fontSize: "14px" }}>
                    Autorizacion descuento nomina
                  </li>
                </ul>

                <ul>
                  <li style={{ textAlign: "start", fontSize: "14px" }}>
                    Pagare
                  </li>
                </ul>

                <div className={styles.boxCharc}>
                  <div className={styles.boxIconChecking}>
                    <TbCircleCheckFilled
                      size={20}
                      className={styles.iconChecking}
                    />
                  </div>
                  <h5>Descuento por nomina</h5>
                </div>

                <div className={styles.boxCharc}>
                  <div className={styles.boxIconChecking}>
                    <TbCircleCheckFilled
                      size={20}
                      className={styles.iconChecking}
                    />
                  </div>
                  <h5>Reporte a las centrales de riesgo</h5>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}

      {creatingLoan == true && (
        <main
          style={{
            minHeight: "70dvh",
            display: "grid",
            placeContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "grid", placeContent: "center" }}>
              <TbLoader className={styles.loaderLoanIcon} size={50} />
            </div>
            <p style={{ textAlign: "center" }}>
              Creando tu solicitud de prestamo
            </p>
          </div>
        </main>
      )}
    </>
  );
}

export default Contract;
