"use client";

import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./page.module.css";
import Avatar from "react-avatar";
import Image from "next/image";
import axios from "axios";
import { AuthUser, GenreUser, ScalarDocument, ScalarUser } from "@/types/User";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import ImageDefault from "@/assets/avatar-default.jpg";

import {
  TbCircleCheckFilled,
  TbFaceId,
  TbPhotoCancel,
  TbPhotoSearch,
  TbPhotoUp,
  TbTextScan2,
  TbTrash,
} from "react-icons/tb";
import LoadingPage from "@/components/Loaders/LoadingPage";
import Modal from "@/components/modal/Modal";
import { pdfjs } from "react-pdf";
import SelectGenre from "@/components/accesories/selectGenre";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Profile({ params }: { params: { userId: string } }) {
  const { user, setUserData } = useGlobalContext();
  const [imagePreview1, setImagePreview1] = useState("");
  const [imagePreview2, setImagePreview2] = useState("");
  const [infoUser, setInfoUser] = useState<ScalarDocument>();
  const [loading, setLoading] = useState(true);

  const [dataProfile, setDataProfile] = useState<ScalarUser | null>(null);

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
      newValue = value.trim(); // Limpiar espacios en blanco
    }

    // Actualizar el estado solo una vez
    setDataProfile((prevData) => ({
      ...(prevData as ScalarUser),
      [key]: newValue,
    }));
  };

  // console.log(dataProfile)

  const handleChangeGenre = (option: string) => {
    setDataProfile((prevData) => ({
      ...(prevData as ScalarUser),
      genre: option as GenreUser,
    }));
  };

  const [numberCc, setNumberCc] = useState<string | null>(null);

  const [selectedImagePerfil, setSelectedImagePerfil] = useState<string | null>(
    null
  );
  const [selectedImageWithCC, setSelectedImageWithCC] = useState<string | null>(
    null
  );
  const [loadingProccessImg01, setLoadingProccessImg01] = useState(false);
  const [loadingProccessImg02, setLoadingProccessImg02] = useState(false);
  const [openDocs, setOpenDocs] = useState<boolean>(false);
  const [contentOpenDoc, setContentOpenDoc] = useState<
    string | undefined | null
  >(user?.avatar);

  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    // setTimeout(() => 2000);
    if (!user) {
      router.push("/auth");
    } else if (user.id !== params.userId) {
      router.push("/");
    }
  }, [user, params.userId, router, loading]);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const getInfoUserDocs = async () => {
      try {
        if (user && user.token) {
          const response = await axios.post(
            "/api/user/list_docs",
            {
              userId: params.userId,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          // console.log(response.data);
          setInfoUser(response.data.data[0]);
          if (response.data && response.data.data && response.data.data[0]) {
            const data: ScalarDocument = response.data.data[0];

            setNumberCc(data.number as string);
            setImagePreview1(data.documentFront as string);
            setImagePreview2(data.documentBack as string);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          console.log(error.cause);
        }
      }
    };

    getInfoUserDocs();
  }, [params.userId, user?.id, user?.token, user]);

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        if (user) {
          const response = await axios.post(
            "/api/user/id",
            {
              userId: user.id,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          // console.log(response)
          const data: ScalarUser = response.data.data;
          // console.log(data);
          setDataProfile(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getInfoUser();
  }, [params.userId, user?.id, user?.token, user]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });

  // console.log(dataProfile);

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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    // console.log(file)

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // console.log(base64String);
        setSelectedImagePerfil(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageWithCC = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    // console.log(file)

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // console.log(base64String);
        setSelectedImageWithCC(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImageFront = useCallback(
    async ({ image }: { image: string }) => {
      try {
        const response = await axios.post(
          "/api/user/docs_update",
          {
            userId: params.userId,
            documentFront: image,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        if (response.data.success) {
          toast.success("Parte frontal actualizada");
        }
      } catch (error) {
        console.error("Error updating document front:", error);
      }
    },
    [params.userId, user?.token]
  );

  const handleSetViewDocImg = ({ image }: { image: string }) => {
    setContentOpenDoc(image);
  };

  const handleOpenViewDocImg = () => {
    setOpenDocs(!openDocs);
  };

  const handleUpdateAvatar = async () => {
    if (selectedImagePerfil !== null) {
      const response = await axios.post(
        "/api/upload/avatar",
        {
          img: selectedImagePerfil,
          userId: user?.id,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (response.data.success) {
        const secure_url = response.data.data;

        const resAddAvatar = await axios.post(
          "/api/user/update_avatar",
          {
            userId: user?.id,
            img: secure_url,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        const { id, names, email, avatar } = resAddAvatar.data.data;
        const updateSessionData = {
          id,
          names,
          email,
          avatar,
          token: user?.token,
        } as AuthUser;
        setUserData(updateSessionData);
        setSelectedImagePerfil(null);
      }
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

      console.log(updateSessionData);
      setUserData(updateSessionData);
      setSelectedImagePerfil(null);
    }
  };

  const handleUpdateImgWithCC = async () => {
    if (selectedImageWithCC !== null) {
      const response = await axios.post(
        "/api/upload/pic_with_cc",
        {
          docId: infoUser && infoUser.id,
          img: selectedImageWithCC,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      // console.log(response);

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
          toast.success("Imagen con cedula cargada");
          setInfoUser(response.data.data);
          setSelectedImageWithCC(secure_url);
        }
      }
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
      console.log(response);
      toast.success("Imagen con cedula eliminada");
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

    // console.log(response);

    if (response.data.success) {
      setImagePreview1(response.data.data[0].documentFront);
      setImagePreview2(response.data.data[0].documentBack);
      toast.success("Documento eliminado");
    } else if (response.data.success == false) {
      toast.error("Imposible eliminar documento");
    }
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
          formData
        );

        console.log(response);

        await handleSubmitImageFront({
          image: response.data,
        });

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
        console.log(imagePreview1);
      }
    },
    [user?.token, user?.id, handleSubmitImageFront, imagePreview1]
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
          formData
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
    [user]
  );

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({ onDrop: onDrop1 });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({ onDrop: onDrop2 });

  return loading ? (
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
                  {selectedImagePerfil !== null && (
                    <div
                      onClick={handleUpdateAvatar}
                      className={styles.btnUpdateFinal}
                    >
                      Actualizar
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.boxInfoUserSelfie}>
              <div className={styles.centerInfoUserSelfie}>
                <div className={styles.boxIconAvatar}>
                  {selectedImageWithCC == null && (
                    <Image
                      priority={true}
                      className={styles.avatarIcon}
                      src={
                        infoUser && infoUser.imageWithCC !== "No definido"
                          ? (infoUser.imageWithCC as string)
                          : ImageDefault
                      }
                      width={300}
                      height={300}
                      alt="logo"
                    />
                  )}
                  {selectedImageWithCC !== null && (
                    <Image
                      className={styles.avatarIcon}
                      src={selectedImageWithCC}
                      alt="withcc"
                      width={600}
                      height={600}
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
                    {selectedImageWithCC !== null && (
                      <div
                        onClick={handleUpdateImgWithCC}
                        className={styles.btnUpdateFinal}
                      >
                        Actualizar
                      </div>
                    )}
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
                        value={dataProfile?.place_of_birth}
                        onChange={(e) =>
                          handleChangeProfile(e, "place_of_birth")
                        }
                        name="place_of_birth"
                      />
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
                        value={dataProfile?.phone}
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
                        value={dataProfile?.residence_phone_number}
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
                        value={dataProfile?.phone_whatsapp}
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
                        value={dataProfile?.residence_address}
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
                        value={dataProfile?.city}
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

        <h1 className={styles.datesBox}>Documentos</h1>

        <div className={styles.boxCc}>
          <div className={styles.boxPartInfo}>
            <p>Cedula de Ciudadania</p>
            <div className={styles.partChange}>
              <input
                className={styles.inputCC}
                type="text"
                value={numberCc !== null ? numberCc : ""}
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
                        <TbPhotoSearch className={styles.viewIcon} size={20} />
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
                    {loadingProccessImg01 &&
                      "Procesando imagen (Este proceso puede tardar unos minutos, tenga paciencia)..."}
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
                        <TbPhotoSearch className={styles.viewIcon} size={20} />
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
                    {loadingProccessImg02 &&
                      "Procesando imagen (Este proceso puede tardar unos minutos, tenga paciencia)"}
                    {!loadingProccessImg02 &&
                      "Toma una foto clara de la parte trasera de tu cedula"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={openDocs} onClose={handleOpenViewDocImg} link={null}>
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

export default Profile;
