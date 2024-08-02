"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./Contract.module.css";
import { useDropzone } from "react-dropzone";
import {
  TbCircleCheckFilled,
  TbFileCertificate,
  TbPhotoSearch,
  TbTrash,
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

  const [dataContract, setDataContract] =
    useState<ScalarLoanApplication | null>(null);

  const [userInfo, setUserInfo] = useState<ScalarUser | null>(null);

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
        if (
          !dataContract.fisrt_flyer &&
          !dataContract.second_flyer &&
          !dataContract.third_flyer
        )
          throw new Error("Volantes de pago incompletos");
        if (!dataContract.labor_card)
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

  const [loading, setLoading] = useState(true);
  const [imagePreview3, setImagePreview3] = useState("No definido");
  const [imagePreview4, setImagePreview4] = useState("No definido");
  const [imagePreview5, setImagePreview5] = useState("No definido");
  const [imagePreview6, setImagePreview6] = useState("No definido");

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

  const handlerOpenModel = ({ link }: { link: string }) => {
    setOpenViewPdf(true);
    setLink(link);
  };

  const handleCloseModel = () => {
    setOpenViewPdf(false);
  };

  const [openDocs, setOpenDocs] = useState<boolean>(false);

  const handleOpenViewDocImg = () => {
    setOpenDocs(!openDocs);
  };

  const handleAcceptTerms = () => {
    setDataContract((prevDataContract) => ({
      ...(prevDataContract as ScalarLoanApplication),
      terms_and_conditions: true,
    }));
  };

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

  const handleDeleteDoc = async (type: string) => {
    const response = await axios.post(
      "/api/user/delete_doc",
      {
        userId,
        type,
      },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );

    // console.log(response);

    if (response.data.success) {
      toast.success("Documento eliminado");
    } else if (response.data.success == false) {
      toast.error("Imposible eliminar documento");
    }
  };

  const handleAuthLoan = async () => {
    try {
      setOpenPreSend(false);
      // console.log(dataContract);

      const response = await axios.post(
        "/api/loan/create",
        {
          loanData: dataContract,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // console.log(response);

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

  const handleSaveSignature = (signatureUrl: string) => {
    setDataContract((prevFormData) => ({
      ...(prevFormData as ScalarLoanApplication),
      signature: signatureUrl,
    }));
  };

  const handleSuccessSignature = () => {
    setSuccessSignature(true);
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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", "labor_card");
        if (user) formData.append("userid", user.id as string);

        // const success = await UploadFile(formData);

        const response = await axios.post(
          "/api/upload/google/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success == false) {
          setLoadingProccessImg03(false);
          toast.error("Error al subir archivo, intente mas tarde");
          console.log(response.data.error);
        }

        if ((response.data.success = true)) {
          setLoadingProccessImg03(false);
          const uri = response.data.data as string;
          setImagePreview3(uri);
          setDataContract((prevDataContract) => ({
            ...(prevDataContract as ScalarLoanApplication),
            labor_card: uri,
          }));
          toast.success("Archivo cargado exitosamente");
        }

        // console.log(response.data.success);
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
          const minSize = 100 * 1024; // 100KB en bytes
          const maxSize = 1 * 1024 * 1024; // 1MB en bytes

          if (file.size < minSize)
            throw new Error("El archivo debe pesar más de 100KB");
          if (file.size > maxSize)
            throw new Error("El archivo debe pesar menos de 1MB");

          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", "paid_flyer_01");
          if (user) formData.append("userid", user.id as string);

          const response = await axios.post(
            "/api/upload/google/create",
            formData,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success == false) {
            setLoadingProccessImg04(false);
            toast.error("Error al subir archivo, intente mas tarde");
            console.log(response.data.error);
          }

          if ((response.data.success = true)) {
            setLoadingProccessImg04(false);
            const uri = response.data.data as string;
            setImagePreview4(uri);
            setDataContract((prevDataContract) => ({
              ...(prevDataContract as ScalarLoanApplication),
              fisrt_flyer: uri,
            }));
            toast.success("Archivo cargado exitosamente");
          }

          // console.log(response.data.success);
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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", "paid_flyer_02");
        if (user) formData.append("userid", user.id as string);

        const response = await axios.post(
          "/api/upload/google/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success == false) {
          setLoadingProccessImg05(false);
          toast.error("Error al subir archivo, intente mas tarde");
          console.log(response.data.error);
        }

        if ((response.data.success = true)) {
          setLoadingProccessImg05(false);
          const uri = response.data.data as string;
          setImagePreview5(uri);
          setDataContract((prevDataContract) => ({
            ...(prevDataContract as ScalarLoanApplication),
            second_flyer: uri,
          }));
          toast.success("Archivo cargado exitosamente");
        }

        // console.log(response.data.success);
      }
    },
    [user]
  );

  const onDrop6 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoadingProccessImg06(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        formData.append("name", "paid_flyer_03");
        if (user) formData.append("userid", user.id as string);

        const response = await axios.post(
          "/api/upload/google/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success == false) {
          setLoadingProccessImg06(false);
          toast.error("Error al subir archivo, intente mas tarde");
          console.log(response.data.error);
        }

        if ((response.data.success = true)) {
          setLoadingProccessImg06(false);
          const uri = response.data.data as string;
          setImagePreview6(uri);
          setDataContract((prevDataContract) => ({
            ...(prevDataContract as ScalarLoanApplication),
            third_flyer: uri,
          }));
          toast.success("Archivo cargado exitosamente");
        }

        // console.log(response.data.success);
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

  // console.log(dataContract);
  if (loading) {
    return <LoadingPage />;
  }

  return (
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
                className={styles.boxInfoPay}
                {...(imagePreview4 === "No definido" ? getRootProps4() : {})}
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
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Primer volante de pago subido
                          </p>
                        </div>
                      </div>

                      <div className={styles.boxDoc}>
                        <button
                          className={styles.btnOpenDoc}
                          onClick={() =>
                            handlerOpenModel({
                              link: imagePreview4,
                            })
                          }
                        >
                          Ver documento
                        </button>
                      </div>

                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                          }}
                        >
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div
                          className={styles.boxIcon}
                          onClick={() => handleDeleteDoc("front")}
                        >
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <CiMoneyCheck1 className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg04 && "Procesando tu volante..."}
                      {!loadingProccessImg04 && "Subir primer volante de pago"}
                    </p>
                  </div>
                )}
              </div>

              <div
                className={styles.boxInfoPay}
                {...(imagePreview5 === "No definido" ? getRootProps5() : {})}
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
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Segundo volante de pago subido
                          </p>
                        </div>
                      </div>

                      <div className={styles.boxDoc}>
                        <button
                          className={styles.btnOpenDoc}
                          onClick={() =>
                            handlerOpenModel({
                              link: imagePreview5,
                            })
                          }
                        >
                          Ver documento
                        </button>
                      </div>

                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                          }}
                        >
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div
                          className={styles.boxIcon}
                          onClick={() => handleDeleteDoc("front")}
                        >
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <CiMoneyCheck1 className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg05 && "Procesando tu volante..."}
                      {!loadingProccessImg05 && "Subir segundo volante de pago"}
                    </p>
                  </div>
                )}
              </div>

              <div
                className={styles.boxInfoPay}
                {...(imagePreview6 === "No definido" ? getRootProps6() : {})}
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
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Tercer volante de pago subido
                          </p>
                        </div>
                      </div>

                      <div className={styles.boxDoc}>
                        <button
                          className={styles.btnOpenDoc}
                          onClick={() =>
                            handlerOpenModel({
                              link: imagePreview4,
                            })
                          }
                        >
                          Ver documento
                        </button>
                      </div>

                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                          }}
                        >
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div
                          className={styles.boxIcon}
                          onClick={() => handleDeleteDoc("front")}
                        >
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <CiMoneyCheck1 className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg06 && "Procesando tu volante..."}
                      {!loadingProccessImg06 && "Subir tercer volante de pago"}
                    </p>
                  </div>
                )}
              </div>

              <h3 className={styles.titleVolantsCard}>
                Carta laboral actualizada
              </h3>

              <div
                className={styles.boxInfoUserCard}
                {...(imagePreview3 === "No definido" ? getRootProps3() : {})}
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
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Carta laboral subido
                          </p>
                        </div>
                      </div>

                      <div className={styles.boxDoc}>
                        <button
                          className={styles.btnOpenDoc}
                          onClick={() =>
                            handlerOpenModel({
                              link: imagePreview3,
                            })
                          }
                        >
                          Ver documento
                        </button>
                      </div>

                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                          }}
                        >
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div
                          className={styles.boxIcon}
                          onClick={() => handleDeleteDoc("front")}
                        >
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <TbFileCertificate
                        className={styles.iconPreview}
                        size={60}
                      />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg03 && "Processando tu documento..."}
                      {!loadingProccessImg03 && "Carga tu carta laboral aqui"}
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
          <ListPdfsAutogenerate data={dataContract as ScalarLoanApplication} />
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

      <Modal isOpen={openTerms} onClose={() => setOpenTerms(false)} link={null}>
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
              <h5>Firma digital de los Documentos pagare</h5>
            </div>

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
  );
}

export default Contract;
