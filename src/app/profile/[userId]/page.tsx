"use client";

import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./page.module.css";
import Avatar from "react-avatar";
import Image from "next/image";
import axios from "axios";
import {
  AuthUser,
  companiesUser,
  GenreUser,
  ScalarDocument,
  ScalarUser,
} from "@/types/User";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { TbArrowNarrowRight } from "react-icons/tb";
import iconWarnComplete from "@/assets/enhorabuena.png";
import ImageDefault from "@/assets/avatar-default.jpg";

import {
  TbCircleCheckFilled,
  TbFaceId,
  TbPhotoCancel,
  TbPhotoUp,
} from "react-icons/tb";
import LoadingPage from "@/components/Loaders/LoadingPage";
import Modal from "@/components/modal/Modal";
import { pdfjs } from "react-pdf";
import SelectGenre from "@/components/accesories/selectGenre";
import { convertToBase64 } from "@/handlers/convertToBase64";
import SelectCompanies from "@/components/accesories/selectCompanies";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Profile({ params }: { params: { userId: string } }) {
  const { user, setUserData } = useGlobalContext();
  const [imagePreview1, setImagePreview1] = useState("No definido");
  const [infoUser, setInfoUser] = useState<ScalarDocument>();
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isWarnComplete, setIsWarnComplete] = useState(false);
  const [dataProfile, setDataProfile] = useState<ScalarUser | null>(null);

  const [v, setV] = useState(false);

  const [numberCc, setNumberCc] = useState<string | null>(null);
  const [upId, setUpId] = useState<string | null>(null);
  const [selectedImagePerfil, setSelectedImagePerfil] = useState<string | null>(
    null
  );
  const [selectedImageWithCC, setSelectedImageWithCC] = useState<string | null>(
    "No definido"
  );
  const [loadingProccessImg01, setLoadingProccessImg01] = useState(false);
  const [openViewPdf, setOpenViewPdf] = useState<boolean>(false);
  const [link, setLink] = useState<string>();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  const handleChangeProfile = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof ScalarUser
  ) => {
    const { value } = e.target;

    // Función para convertir la fecha en formato ISO
    const formatDate = (date: Date | string): string | undefined => {
      if (typeof date === "string") {
        // Si ya es una cadena, devolverla tal cual
        return date.trim();
      }
      if (date instanceof Date && !isNaN(date.getTime())) {
        // Convertir la fecha en formato ISO si es una fecha válida
        return date.toISOString();
      }
      return undefined;
    };

    // Convertir el valor según el tipo de clave
    let newValue: string | Date | undefined;

    if (key === "birth_day") {
      const dateValue = new Date(value);
      newValue = formatDate(dateValue)
        ? new Date(formatDate(dateValue)!)
        : undefined;
    } else {
      newValue = value;
    }

    // Actualizar el estado solo una vez
    setDataProfile((prevData) => ({
      ...(prevData as ScalarUser),
      [key]: newValue,
    }));
  };

  const handleChangeGenre = (option: string) => {
    setDataProfile((prevData) => ({
      ...(prevData as ScalarUser),
      genre: option as GenreUser,
    }));
  };

  const handleChangeCompanie = (option: companiesUser) => {
    setDataProfile((prevData) => ({
      ...(prevData as ScalarUser),
      currentCompanie: option,
    }));
  };

  const handleCloseModel = () => {
    setOpenViewPdf(false);
  };

  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated and authorized
    if (user === undefined || user === null) return;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (user.id !== params.userId) {
      window.location.href = "/";
      return;
    }

    // Fetch user information and documents
    const getInfoUserDocs = async () => {
      try {
        if (user.token) {
          const response = await axios.post(
            "/api/user/list_docs",
            { userId: params.userId },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setInfoUser(response.data.data[0]);
          if (response.data.data[0]) {
            const data: ScalarDocument = response.data.data[0];
            setNumberCc(data.number as string);
            setImagePreview1(data.documentSides as string);
            setSelectedImageWithCC(data.imageWithCC as string);
            setUpId(data.upId as string);
          }
          setLoadingData(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getInfoUser = async () => {
      try {
        const response = await axios.post(
          "/api/user/id",
          { userId: user.id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setDataProfile(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    getInfoUserDocs();
    getInfoUser();
  }, [user, params.userId, router]);

  useEffect(() => {
    const verifyDocs = async () => {
      const response = await axios.post(
        "/api/user/docs_exist",
        { userId: dataProfile?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // console.log(response)

      if (response.data.success == true) {
        const isComplete = response.data.data.complete;
        setIsProfileComplete(isComplete);
        setIsWarnComplete(true);
      }
    };

    verifyDocs();
  }, [v, dataProfile]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });

  const handleUpdatePreviewLoads = async () => {
    try {
      const { id, password, createdAt, updatedAt, ...dataToUpdate } =
        dataProfile as ScalarUser;
      // Enviar solo las propiedades definidas en updateData
      const response = await axios.put(
        "/api/loan/update",
        {
          userId: user?.id as string,
          data: dataToUpdate,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (response.data.success === true) {
        setV((prev) => !prev);
        toast.success("Tus datos han sido actualizados");
      } else if (response.data.success === false) {
        throw new Error("Error al actualizar tus datos");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      // Convierte la imagen a base64 y actualiza el estado
      const base64String = await convertToBase64(file);
      setSelectedImagePerfil(base64String);

      // Sube la imagen al servidor
      const formData = new FormData();
      formData.append("img", file);
      formData.append("userId", params.userId);

      const uploadResponse = await axios.post("/api/upload/avatar", formData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      console.log(uploadResponse);

      if (!uploadResponse.data.success) {
        throw new Error("Error en la carga de imagen");
      }

      const secureUrl = uploadResponse.data.data;

      // Actualiza el avatar del usuario
      const updateResponse = await axios.post(
        "/api/user/update_avatar",
        { userId: user?.id, img: secureUrl },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      console.log(updateResponse);

      if (!updateResponse.data.success) {
        throw new Error("Error al actualizar el avatar");
      }

      const { id, names, email, avatar } = updateResponse.data.data;
      const updateSessionData = {
        id,
        names,
        email,
        avatar,
        token: user?.token,
      } as AuthUser;

      setUserData(updateSessionData);
      setSelectedImagePerfil(null);
    } catch (error) {
      console.error("Error al cambiar la imagen:", error);
    }
  };

  const handleImageWithCC = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (!file) return;

    try {
      const base64String = await convertToBase64(file);

      setSelectedImageWithCC(base64String);

      const response = await axios.post(
        "/api/upload/pic_with_cc",
        {
          docId: infoUser && infoUser.id,
          img: base64String,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.success) {
        const secure_url = response.data.data;

        const resAddPic = await axios.post(
          "/api/user/img_with_cc",
          {
            docId: infoUser && infoUser.id,
            image: secure_url,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        if (resAddPic.data.success) {
          const response = await axios.post(
            "/api/user/list_docs",
            {
              userId: params.userId,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          setV((prev) => !prev);
          toast.success("Verificacion creada");
          setInfoUser(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error al manejar la imagen con CC:", error);
    }
  };

  const handleDeleteAvatar = async () => {
    const response = await axios.post(
      "/api/upload/delete_avatar",
      {
        userId: user?.id,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    console.log(response);

    if (response.data.success) {
      const { id, names, email, avatar } = response.data.data;
      const updateSessionData = {
        id,
        names,
        email,
        avatar,
        token: user?.token,
      } as AuthUser;

      // console.log(updateSessionData);
      setUserData(updateSessionData);
      setSelectedImagePerfil(null);
    }
  };

  const handleDeleteImgWithCC = async () => {
    const response = await axios.post(
      "/api/upload/delete_pic_with_cc",
      {
        docId: infoUser && infoUser.id,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    if (response.data.success) {
      setSelectedImageWithCC("No definido");
      toast.success("Imagen con cedula eliminada");
    }
  };

  const handleSubmitNumberCc = async () => {
    const response = await axios.post(
      "/api/user/docs_update",
      {
        userId: params.userId,
        number: numberCc,
        documentSides: undefined,
        upId: undefined,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    // console.log(response);
    if (response.data.success == true) {
      setV((prev) => !prev);
      toast.success("Numero de cedula actualizado");
    }
    // console.log(response);
  };

  const handleDeleteDoc = async () => {
    // console.log(infoUser?.upId as string);
    const response = await axios.post(
      "/api/user/delete_doc",
      {
        userId: params.userId,
        type: "ccScans",
        upId: upId,
      },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );

    // console.log(response);

    if (response.data.success == true) {
      setImagePreview1("No definido");
      toast.success("Documento eliminado");
    } else if (response.data.success == false) {
      toast.error("Imposible eliminar documento");
    }
  };

  const onDrop1 = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setLoadingProccessImg01(true);

      const file = acceptedFiles[0];

      const allowedExtensions = ["application/pdf"];
      if (!allowedExtensions.includes(file.type)) {
        setLoadingProccessImg01(false);
        toast.error("El archivo debe ser un PDF");
        throw new Error("El archivo debe ser un PDF");
      }

      const maxSize = 2.5 * 1024 * 1024; // 2.5MB en bytes

      if (file.size > maxSize) {
        throw new Error("El archivo debe pesar menos de 2.5MB");
      }

      try {
        const file = acceptedFiles[0];
        // console.log(file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user?.id as string);
        formData.append("name", "ccScans");

        const addFirstFlayer = await axios.post(
          "/api/upload/google/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(addFirstFlayer);

        if (addFirstFlayer.data.success == true) {
          const data = addFirstFlayer.data.data;
          const link = data.link;
          const upId = data.upid;

          const updateDocResponse = await axios.post(
            "/api/user/docs_update",
            {
              userId: user?.id,
              documentSides: link,
              upId,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );

          if (updateDocResponse.data.success === true) {
            setV((prev) => !prev);
            toast.success("Documento subido");
            setUpId(upId);
            setImagePreview1(link);
            setLoadingProccessImg01(false);
          } else {
            toast.error("Error actualizando el documento");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("Ocurrió un error al procesar la imagen");
      }
    },
    [user?.token, user?.id]
  );

  const handlerOpenModel = ({ link }: { link: string }) => {
    setOpenViewPdf(true);
    setLink(link);
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({ onDrop: onDrop1 });

  return loading || loadingData ? (
    <LoadingPage />
  ) : (
    <>
      <main className={styles.containerPerfil}>
        <div className={styles.boxImagePerfil}>
          <div className={styles.barPicturesAuth}>
            <div className={styles.boxInfoUserAvatar}>
              <div className={styles.centerInfoUserAvatar}>
                <div className={styles.boxIconAvatar}>
                  {selectedImagePerfil == null && (
                    <Avatar
                      className={styles.avatarIcon}
                      src={user?.avatar}
                      round={true}
                      size={isTabletOrMobile ? "170px" : "320px"}
                    />
                  )}
                  {selectedImagePerfil !== null && (
                    <Avatar
                      className={styles.avatarIcon}
                      src={selectedImagePerfil}
                      round={true}
                      size={isTabletOrMobile ? "200px" : "300px"}
                    />
                  )}
                </div>
              </div>
              <div className={styles.boxChangeImage}>
                <div className={styles.textsChangeImage}>
                  <h5>Foto de perfil</h5>
                  <p>
                    Por favor, sube una foto clara y bien iluminada de tu rostro
                    para usar como avatar en tu cuenta, asegurando que sea única
                    y fácilmente reconocible.
                  </p>
                </div>
                <div className={styles.centerBoxChangeImg}>
                  <label
                    htmlFor="file-upload"
                    className={styles.customFileUpload}
                  >
                    <div className={styles.centerlabel}>
                      <div className={styles.boxIconLabel}>
                        <TbPhotoUp
                          size={20}
                          className={styles.iconUpdateAvatar}
                        />
                      </div>
                      <p>Cambiar</p>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    className={styles.btnChangeImage}
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div
                    className={styles.btnDeleteAvatar}
                    onClick={handleDeleteAvatar}
                  >
                    <div className={styles.centerBtnDeleteAvatar}>
                      <div className={styles.boxIconLabel}>
                        <TbPhotoCancel
                          className={styles.iconCancelAvatar}
                          size={20}
                        />
                      </div>
                      <p>Eliminar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.boxInfoUserSelfie}>
              <div className={styles.centerInfoUserSelfie}>
                <div className={styles.boxIconAvatar}>
                  {selectedImageWithCC == "No definido" && (
                    <Image
                      priority={true}
                      className={styles.avatarIconCC}
                      src={
                        selectedImageWithCC !== "No definido"
                          ? selectedImageWithCC!
                          : ImageDefault
                      }
                      width={"200"}
                      height={"300"}
                      alt="logo"
                    />
                  )}
                  {selectedImageWithCC !== "No definido" && (
                    <Image
                      priority={true}
                      className={styles.avatarIconCC}
                      src={selectedImageWithCC as string}
                      alt="withcc"
                      width={"200"}
                      height={"300"}
                    />
                  )}
                </div>

                <div className={styles.boxChangeImage}>
                  <div className={styles.textsChangeImage}>
                    <h5>Verifica tu identidad</h5>
                    <p>
                      Sube una selfie donde aparezcas desde tu pecho hasta la
                      cabeza y mostrando en alguna de las manos tu cedula por el
                      lado frontal
                    </p>
                  </div>
                  <div className={styles.centerBoxChangeImg}>
                    <label
                      htmlFor="file-upload-pic"
                      className={styles.customFileUpload}
                    >
                      <div className={styles.centerlabel}>
                        <div className={styles.boxIconLabel}>
                          <TbPhotoUp
                            size={20}
                            className={styles.iconUpdateAvatar}
                          />
                        </div>
                        <p>Cambiar</p>
                      </div>
                    </label>
                    <input
                      id="file-upload-pic"
                      className={styles.btnChangeImage}
                      type="file"
                      onChange={handleImageWithCC}
                      accept="image/*"
                    />
                    <div
                      className={styles.btnDeleteAvatar}
                      onClick={handleDeleteImgWithCC}
                    >
                      <div className={styles.centerBtnDeleteAvatar}>
                        <div className={styles.boxIconLabel}>
                          <TbPhotoCancel
                            className={styles.iconCancelAvatar}
                            size={20}
                          />
                        </div>
                        <p>Eliminar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.boxInputsInfo}>
            <div className={styles.centerBoxInputsInfo}>
              <h1>Datos Personales</h1>
              <div className={styles.supraPartCenter}>
                <div className={styles.partCenter}>
                  <div className={styles.boxPartInfo}>
                    <p>Genero</p>
                    <div className={styles.partChange}>
                      <SelectGenre
                        select={handleChangeGenre}
                        valueDefault={dataProfile?.genre || ""}
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Nombre(s)</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={dataProfile?.names}
                        onChange={(e) => handleChangeProfile(e, "names")}
                        name="names"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Primer Apellido</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={dataProfile?.firstLastName}
                        onChange={(e) =>
                          handleChangeProfile(e, "firstLastName")
                        }
                        name="firstLastName"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Segundo Apellido</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={dataProfile?.secondLastName}
                        onChange={(e) =>
                          handleChangeProfile(e, "secondLastName")
                        }
                        name="secondLastName"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Fecha de nacimiento</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="date"
                        value={
                          dataProfile?.birth_day
                            ? new Date(dataProfile?.birth_day)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) => handleChangeProfile(e, "birth_day")}
                        name="birth_day"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Lugar de nacimiento</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.place_of_birth == "No definido"
                            ? ""
                            : dataProfile?.place_of_birth
                        }
                        onChange={(e) =>
                          handleChangeProfile(e, "place_of_birth")
                        }
                        name="place_of_birth"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>A que Empresa perteneces</p>
                    <div className={styles.partChange}>
                      <SelectCompanies
                        select={handleChangeCompanie}
                        valueDefault={dataProfile?.currentCompanie || ""}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.partCenter}>
                  <div className={styles.boxPartInfo}>
                    <p>Correo electronico</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={dataProfile?.email || ""}
                        onChange={(e) => handleChangeProfile(e, "email")}
                        name="email"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Numero celular</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.phone == "No definido"
                            ? ""
                            : dataProfile?.phone
                        }
                        onChange={(e) => handleChangeProfile(e, "phone")}
                        name="phone"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Telefono residencia</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.residence_phone_number == "No definido"
                            ? ""
                            : dataProfile?.residence_phone_number
                        }
                        onChange={(e) =>
                          handleChangeProfile(e, "residence_phone_number")
                        }
                        name="residence_phone_number"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Numero Whatsapp</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.phone_whatsapp == "No definido"
                            ? ""
                            : dataProfile?.phone_whatsapp
                        }
                        onChange={(e) =>
                          handleChangeProfile(e, "phone_whatsapp")
                        }
                        name="phone_whatsapp"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Direccion de residencia</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.residence_address == "No definido"
                            ? ""
                            : dataProfile?.residence_address
                        }
                        onChange={(e) =>
                          handleChangeProfile(e, "residence_address")
                        }
                        name="residence_address"
                      />
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Ciudad de residencia</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          dataProfile?.city == "No definido"
                            ? ""
                            : dataProfile?.city
                        }
                        onChange={(e) => handleChangeProfile(e, "city")}
                        name="city"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.boxCenterUpdate}>
                <button onClick={handleUpdatePreviewLoads}>Actualizar</button>
              </div>
            </div>
          </div>
        </div>

        <h1 className={styles.datesBox}>Documento de identidad</h1>

        <div className={styles.boxCc}>
          <div className={styles.boxPartInfo}>
            <p>Numero de cedula</p>
            <div className={styles.partChange}>
              <input
                className={styles.inputCC}
                type="text"
                value={numberCc == "No definido" ? "" : (numberCc as string)}
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
            <p className={styles.titleDocScan}>Cedula escaneada (PDF)</p>
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
                        <p className={styles.warninCC}>Cedula de ciudadania</p>
                      </div>
                    </div>

                    <div className={styles.optionsBox}>
                      <button
                        className={styles.btnOpenDocRemove}
                        onClick={() => handleDeleteDoc()}
                      >
                        Eliminar
                      </button>

                      <button
                        className={styles.btnOpenDoc}
                        onClick={() =>
                          handlerOpenModel({
                            link: imagePreview1,
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
                    <TbFaceId className={styles.iconPreview} size={60} />
                  </div>
                  <p className={styles.textPreview}>
                    {loadingProccessImg01 && "Procesando documentos..."}
                    {!loadingProccessImg01 &&
                      "Adjunte o arrastre su documento pdf con la cedula por lado y lado"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isProfileComplete && isWarnComplete && (
          <>
            <div
              className={styles.warnComplete}
              onClick={() => (window.location.href = "/dashboard")}
            >
              <div className={styles.boxCompleteWarn}>
                <div className={styles.boxIconWarn}>
                  <Image
                    src={iconWarnComplete}
                    className={styles.iconWarn}
                    alt={"icon"}
                  />
                </div>
                <div className={styles.boxText}>
                  <h5>Perfil Completado</h5>
                  <p>Ya puedes comenzar a solicitar tus prestamos</p>
                </div>
              </div>

              <div className={styles.boxIconArrow}>
                <TbArrowNarrowRight size={20} />
              </div>
            </div>
          </>
        )}
      </main>

      <Modal
        isOpen={openViewPdf}
        onClose={handleCloseModel}
        link={link as string}
      >
        <p>hola</p>
      </Modal>
    </>
  );
}

export default Profile;
