"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./page.module.css";
import CopyText from "@/components/accesories/CopyText";
import Avatar from "react-avatar";
import Image from "next/image";
import axios from "axios";
import { ScalarDocument, ScalarUser } from "@/types/User";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { v2 as cloudinary } from "cloudinary";

import {
  TbCircleCheckFilled,
  TbFaceId,
  TbFileSearch,
  TbLicense,
  TbPhotoSearch,
  TbTextScan2,
  TbTrash,
} from "react-icons/tb";
import LoadingPage from "@/components/Loaders/LoadingPage";
import Modal from "@/components/modal/Modal";

function Profile({ params }: { params: { userId: string } }) {
  const [imagePreview1, setImagePreview1] = useState("");
  const [imagePreview2, setImagePreview2] = useState("");
  const [imagePreview3, setImagePreview3] = useState("");
  const [infoUser, setInfoUser] = useState<ScalarDocument[]>();
  const [loading, setLoading] = useState(true);
  const [completeInfoUser, setCompleteInfoUser] = useState<ScalarUser | null>(
    null
  );

  const [numberCc, setNumberCc] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [detailEmail, setDetailEmail] = useState<string | null>(null);
  const [celPhone, setCelPhone] = useState<string | null>(null);
  const [firstLastName, setFirstLastName] = useState<string | null>(null);
  const [secondLastName, setSecondLastName] = useState<string | null>(null);
  const [residenceNumber, setResidenceNumber] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [celPhoneWs, setCelPhoneWs] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [placeBirthday, setPlaceBirthday] = useState<string | null>(null);
  const [addressResidence, setAddressResidence] = useState<string | null>(null);
  const [cityResidence, setCityResidence] = useState<string | null>(null);

  const [loadingProccessImg01, setLoadingProccessImg01] = useState(false);
  const [loadingProccessImg02, setLoadingProccessImg02] = useState(false);
  const [loadingProccessImg03, setLoadingProccessImg03] = useState(false);

  const [openDocs, setOpenDocs] = useState<boolean>(false);
  const [contentOpenDoc, setContentOpenDoc] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useGlobalContext();

  useEffect(() => {
    const getInfoUserDocs = async () => {
      const response = await axios.post(
        "/api/user/list_docs",
        {
          userId: params.userId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log(response.data);
      setInfoUser(response.data.data);
      if (response.data && response.data.data && response.data.data[0]) {
        setImagePreview1(response.data.data[0].documentFront);
        setImagePreview2(response.data.data[0].documentBack);
      }
      setLoading(false);
    };

    const getInfoUser = async () => {
      const response = await axios.post(
        "/api/user/id",
        {
          userId: params.userId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log(response);
      const data: ScalarUser = response.data.data;
      console.log(data);
      setName(data.names);
      setFirstLastName(data.firstLastName);
      setSecondLastName(data.secondLastName);
      setCelPhone(data.phone as string);
      setResidenceNumber(data.residence_phone_number as string);
      setGenre(data.genre as string);
      setCelPhoneWs(data.phone_whatsapp as string);
      setBirthday(new Date(data.birth_day as Date));
      setCityResidence(data.city as string);
      setCompleteInfoUser(data);
    };

    getInfoUserDocs();
    getInfoUser();
  }, [params.userId, user]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });

  const handleSubmitImageFront = async ({ image }: { image: string }) => {
    const response = await axios.post(
      "/api/user/docs_update",
      {
        userId: params.userId,
        documentFront: image,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    console.log(response);

    if (response.data.success) {
      toast.success("Parte frontal actualizada");
    }
  };

  const handleSubmitImageBack = async ({ image }: { image: string }) => {
    const response = await axios.post(
      "/api/user/docs_update",
      {
        userId: params.userId,
        documentBack: image,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    // console.log(response);

    if (response.data.success) {
      toast.success("Parte trasera actualizada");
    }
  };

  const handleSetViewDocImg = ({ image }: { image: string }) => {
    setContentOpenDoc(image);
  };

  const handleOpenViewDocImg = () => {
    setOpenDocs(!openDocs);
  };

  const onDrop1 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoadingProccessImg01(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("img", file);
        formData.append("userId", user?.id as string);
        formData.append("type", "front");
        const formDataArray = Array.from(formData.entries());
        console.log(formDataArray);
        console.log(formData);
        console.log(process.env.NEXT_PUBLIC_ENDPOINT_PROCESS_IMG);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_ENDPOINT_PROCESS_IMG}`,
          formData,
          {
            headers: {
              // Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await handleSubmitImageFront({
          image: response.data,
        });

        console.log(response);

        if (response.data.success) {
          const resChangeDoc = await axios.post(
            "/api/user/docs_update",
            {
              userId: user?.id,
              documentFront: response.data.data,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );

          console.log(resChangeDoc);

          if (resChangeDoc.data.success) toast.success("Documento subido");
        }
        // console.log("url: ", response.data);
        setLoadingProccessImg01(false);
        setImagePreview1(response.data.data);
        console.log(imagePreview1)
      }
    },
    [user?.token, handleSubmitImageFront]
  );

  const onDrop2 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg02(true);
      if (file) {
        const formData = new FormData();
        formData.append("img", file);
        formData.append("userId", user?.id as string);
        formData.append("type", "back");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_ENDPOINT_PROCESS_IMG}`,
          formData,
          {
            headers: {
              // Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          const resChangeDoc = await axios.post(
            "/api/user/docs_update",
            {
              userId: user?.id,
              documentBack: response.data.data,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );

          console.log(resChangeDoc);

          if (resChangeDoc.data.success) toast.success("Documento subido");
        }
        // console.log(response);
        setLoadingProccessImg02(false);
        setImagePreview2(response.data.data);
      }
    },
    [user, handleSubmitImageBack]
  );

  const onDrop3 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg03(true);
      if (file) {
        const formData = new FormData();
        formData.append("img", file);
        formData.append("userId", user?.id as string);
        formData.append("type", "letter");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_ENDPOINT_PROCESS_IMG}`,
          formData,
          {
            headers: {
              // Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await handleSubmitImageBack({
          image: response.data,
        });
        // console.log(response);
        setLoadingProccessImg03(false);
        setImagePreview3(response.data);
      }
    },
    [user, handleSubmitImageBack]
  );

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({ onDrop: onDrop1 });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({ onDrop: onDrop2 });
  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } =
    useDropzone({ onDrop: onDrop3 });

  const handleUpdatePreviewLoads = async (
    updateData: Partial<Omit<ScalarUser, "password">>
  ): Promise<void> => {
    try {
      console.log(updateData);

      // Filtrar las propiedades de updateData que no sean "password" y sean de tipo string
      const filteredUpdateData: Partial<Omit<ScalarUser, "password">> =
        Object.fromEntries(
          Object.entries(updateData).filter(
            ([key, value]) =>
              key !== "password" &&
              (typeof value === "string" || value instanceof Date)
          )
        );

      console.log(filteredUpdateData);

      // Enviar solo las propiedades definidas en updateData
      const response = await axios.put(
        "/api/loan/update",
        {
          userId: user?.id as string,
          data: filteredUpdateData,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      console.log(response.data.error);

      if (response.data.success === true) {
        toast.success("Dato actualizado");
      } else if (response.data.success === false) {
        throw new Error("Error al actualizar dato");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleSubmitNumberCc = async () => {
    const response = await axios.post(
      "/api/user/docs_update",
      {
        userId: params.userId,
        number: numberCc,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );
    if (response.data.success == true) {
      toast.success("Numero de cedula actualizado");
    }
    // console.log(response);
  };

  const handleDeleteDoc = async (type: string) => {
    
    const response = await axios.post(
      "/api/user/delete_doc",
      {
        userId: params.userId,
        type,
      },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );

    console.log(response);

    if (response.data.success) {
      setImagePreview1(response.data.data[0].documentFront)
      setImagePreview2(response.data.data[0].documentBack)
      toast.success("Documento eliminado");
    } else if (response.data.success == false) {
      toast.error("Imposible eliminar documento");
    }
  };

  if (loading) {
    return <LoadingPage />; // Aquí puedes reemplazar con tu componente de carga
  }

  if (!user) {
    router.push("/auth");
  } else if (user.id != params.userId) {
    router.push(`/profile/${user.id}`);
  }

  if (user && user.id === params.userId) {
    return (
      <>
        <main className={styles.containerPerfil}>
          <CopyText text={params.userId} copy={true} />
          <h1>Identificacion</h1>

          <div className={styles.boxImagePerfil}>
            <div className={styles.boxInfoUserAvatar}>
              <Avatar
                className={styles.avatarIcon}
                src={user?.avatar}
                round={true}
                size={isTabletOrMobile ? "200px" : "300px"}
              />
            </div>

            <div className={styles.boxInputsInfo}>
              <div className={styles.centerBoxInputsInfo}>
                <h1>Datos Personales</h1>
                <div className={styles.supraPartCenter}>
                  <div className={styles.partCenter}>
                    <div className={styles.boxPartInfo}>
                      <p>Genero</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            genre !== null
                              ? genre
                              : completeInfoUser?.genre || ""
                          }
                          onChange={(e) => setGenre(e.target.value)}
                        />
                        <button
                          onClick={() =>
                            handleUpdatePreviewLoads({ genre: genre as string })
                          }
                          className={styles.btnSaveInfo}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Nombre(s)</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={name !== null ? name : user.names || ""}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({ names: name as string })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Primer Apellido</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            firstLastName !== null
                              ? firstLastName
                              : completeInfoUser?.firstLastName || ""
                          }
                          onChange={(e) => setFirstLastName(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              firstLastName: firstLastName as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Segundo Apellido</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            secondLastName !== null
                              ? secondLastName
                              : completeInfoUser?.secondLastName || ""
                          }
                          onChange={(e) => setSecondLastName(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              secondLastName: secondLastName as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Fecha de nacimiento</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="date"
                          value={
                            birthday ? birthday.toISOString().split("T")[0] : ""
                          }
                          onChange={(e) =>
                            setBirthday(new Date(e.target.value))
                          }
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              birth_day: birthday as Date,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Lugar de nacimiento</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            placeBirthday !== null
                              ? placeBirthday
                              : completeInfoUser?.place_of_birth || ""
                          }
                          onChange={(e) => setPlaceBirthday(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              place_of_birth: placeBirthday as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.partCenter}>
                    <div className={styles.boxPartInfo}>
                      <p>Email</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            detailEmail !== null
                              ? detailEmail
                              : user.email || ""
                          }
                          onChange={(e) => setDetailEmail(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              email: detailEmail as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Numero celular</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            celPhone !== null
                              ? celPhone
                              : completeInfoUser?.phone || ""
                          }
                          onChange={(e) => setCelPhone(e.target.value)}
                        />
                        <button
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              phone: celPhone as string,
                            })
                          }
                          className={styles.btnSaveInfo}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Telefono residencia</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            residenceNumber !== null
                              ? residenceNumber
                              : completeInfoUser?.residence_phone_number || ""
                          }
                          onChange={(e) => setResidenceNumber(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              residence_phone_number: residenceNumber as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Numero Whatsapp</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            celPhoneWs !== null
                              ? celPhoneWs
                              : completeInfoUser?.phone_whatsapp || ""
                          }
                          onChange={(e) => setCelPhoneWs(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              phone_is_wp: true,
                              phone_whatsapp: celPhoneWs as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Direccion de residencia</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            addressResidence !== null
                              ? addressResidence
                              : completeInfoUser?.residence_address || ""
                          }
                          onChange={(e) => setAddressResidence(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              residence_address: addressResidence as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    <div className={styles.boxPartInfo}>
                      <p>Ciudad de residencia</p>
                      <div className={styles.partChange}>
                        <input
                          className={styles.inputCC}
                          type="text"
                          value={
                            cityResidence !== null
                              ? cityResidence
                              : completeInfoUser?.city || ""
                          }
                          onChange={(e) => setCityResidence(e.target.value)}
                        />
                        <button
                          className={styles.btnSaveInfo}
                          onClick={() =>
                            handleUpdatePreviewLoads({
                              city: cityResidence as string,
                            })
                          }
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className={styles.datesBox}>Documentos</h1>

          <div className={styles.boxCc}>
            <div className={styles.boxPartInfo}>
              <p>Cedula de Ciudadania</p>
              <div className={styles.partChange}>
                <input
                  className={styles.inputCC}
                  type="text"
                  value={
                    numberCc !== null
                      ? numberCc
                      : (infoUser && infoUser[0] && infoUser[0].number) || ""
                  }
                  onChange={(e) => setNumberCc(e.target.value)}
                />
                <button
                  onClick={handleSubmitNumberCc}
                  className={styles.btnSaveInfo}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>

          <div className={styles.containerDocumentsImgs}>
            <div className={styles.onlyImgsDocs}>
              <div
                className={styles.boxInfoUser}
                {...(imagePreview1 === "No definido" ? getRootProps1() : {})}
              >
                {imagePreview1 === "No definido" && (
                  <input {...getInputProps1()} />
                )}
                {imagePreview1 && imagePreview1 != "No definido" ? (
                  <>
                    <div className={styles.supraBarStatus}>
                      <div className={styles.barStatusDocs}>
                        <div className={styles.headerCardStatus}>
                          <div className={styles.boxIconStatus}>
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Documento frontal subido
                          </p>
                        </div>
                      </div>

                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                            handleSetViewDocImg({ image: imagePreview1 });
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
                      <TbFaceId className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg01 && "Processando tu documento..."}
                      {!loadingProccessImg01 &&
                        "Toma una foto clara de la parte frontal de tu cedula"}
                    </p>
                  </div>
                )}
              </div>

              <div
                className={styles.boxInfoUser}
                {...(imagePreview2 === "No definido" ? getRootProps2() : {})}
              >
                {imagePreview2 === "No definido" && (
                  <input {...getInputProps2()} />
                )}

                {imagePreview2 && imagePreview2 != "No definido" ? (
                  <>
                    <div className={styles.supraBarStatus}>
                      <div className={styles.barStatusDocs}>
                        <div className={styles.headerCardStatus}>
                          <div
                            className={styles.boxIconStatus}
                            onClick={() => {
                              handleOpenViewDocImg();
                              handleSetViewDocImg({ image: imagePreview2 });
                            }}
                          >
                            <TbCircleCheckFilled className={styles.iconCheck} />
                          </div>
                          <p className={styles.warninCC}>
                            Documento posterior subido
                          </p>
                        </div>
                      </div>
                      <div className={styles.boxIconsStatus}>
                        <div
                          onClick={() => {
                            handleOpenViewDocImg();
                            handleSetViewDocImg({ image: imagePreview2 });
                          }}
                          className={styles.boxIcon}
                        >
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div
                          className={styles.boxIcon}
                          onClick={() => handleDeleteDoc("back")}
                        >
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <TbTextScan2 className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg02 && "Processando tu documento..."}
                      {!loadingProccessImg02 &&
                        "Toma una foto clara de la parte trasera de tu cedula"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardLaboral}>
              {/* <h2>Ingresa tu carta laboral actualizada</h2> */}
              <div
                className={styles.boxInfoUser}
                {...(imagePreview3 === "No definido" ? getRootProps3() : {})}
              >
                {imagePreview3 === "No definido" && (
                  <input {...getInputProps3()} />
                )}
                {imagePreview3 && imagePreview3 != "No definido" ? (
                  <>
                    {/* <Image
                      className={styles.avatarIcon}
                      src={imagePreview2}
                      alt="img"
                      width={200}
                      height={300}
                    /> */}
                    <div className={styles.barStatusDocs}>
                      <div className={styles.headerCardStatus}>
                        <div className={styles.boxIconStatus}>
                          <TbCircleCheckFilled className={styles.iconCheck} />
                        </div>
                        <p className={styles.warninCC}>Carta laboral subida</p>
                      </div>
                      <div className={styles.boxIconsStatus}>
                        <div
                          className={styles.boxIcon}
                          onClick={() => {
                            handleOpenViewDocImg();
                            handleSetViewDocImg({ image: imagePreview3 });
                          }}
                        >
                          <TbFileSearch className={styles.viewIcon} size={20} />
                        </div>
                        <div className={styles.boxIcon}>
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.containerDropDocuments}>
                    <div className={styles.boxIconPreview}>
                      <TbLicense className={styles.iconPreview} size={60} />
                    </div>
                    <p className={styles.textPreview}>
                      {loadingProccessImg03 && "Processando tu documento"}
                      {!loadingProccessImg03 &&
                        "Sube tu carta laboral actualizada"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Modal isOpen={openDocs} onClose={handleOpenViewDocImg}>
            <div className={styles.boxImageDocPrev}>
              <Image
                src={contentOpenDoc as string}
                alt="content"
                width={300}
                height={300}
                className={styles.imgPrevDoc}
              />
            </div>
          </Modal>
        </main>
      </>
    );
  }
}

export default Profile;
