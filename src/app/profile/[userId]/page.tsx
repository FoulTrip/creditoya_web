"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./page.module.css";
import CopyText from "@/components/accesories/CopyText";
import Avatar from "react-avatar";
import Image from "next/image";
import axios from "axios";
import { ScalarDocument } from "@/types/User";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Auth";
import { RemoveImage } from "@/handlers/removeBackground";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import {
  TbCircleCheckFilled,
  TbFileSearch,
  TbPhotoSearch,
  TbTrash,
} from "react-icons/tb";
import LoadingPage from "@/components/Loaders/LoadingPage";

function Profile({ params }: { params: { userId: string } }) {
  const [imagePreview1, setImagePreview1] = useState("");
  const [imagePreview2, setImagePreview2] = useState("");
  const [infoUser, setInfoUser] = useState<ScalarDocument[]>();
  const [loading, setLoading] = useState(true);
  const [numberCc, setNumberCc] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [detailEmail, setDetailEmail] = useState<string | null>(null);

  const [loadingProccessImg01, setLoadingProccessImg01] = useState(false);
  const [loadingProccessImg02, setLoadingProccessImg02] = useState(false);
  const router = useRouter();

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });

  const { user } = useGlobalContext();

  const onDrop1 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg01(true);
      const ProccessedFile = await RemoveImage(file);
      if (ProccessedFile) {
        const formData = new FormData();
        formData.append("file", ProccessedFile);
        const formDataArray = Array.from(formData.entries());
        console.log(formDataArray);
        console.log(formData);
        const response = await axios.post("/api/upload", formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        await handleSubmitImageFront({
          image: response.data,
        });
        // console.log(response);
        // console.log("url: ", response.data);
        setImagePreview1(response.data);
      }
    },
    [user?.token]
  );

  const onDrop2 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg02(true);
      const ProccessedFile = await RemoveImage(file);
      if (ProccessedFile) {
        const formData = new FormData();
        formData.append("file", ProccessedFile as File);
        const response = await axios.post("/api/upload", formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        await handleSubmitImageBack({
          image: response.data,
        });
        // console.log(response);
        setLoadingProccessImg02(false);
        setImagePreview2(response.data);
      }
    },
    [user?.token]
  );

  const onDrop3 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg02(true);
      const ProccessedFile = await RemoveImage(file);
      if (ProccessedFile) {
        const formData = new FormData();
        formData.append("file", ProccessedFile as File);
        const response = await axios.post("/api/upload", formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        await handleSubmitImageBack({
          image: response.data,
        });
        // console.log(response);
        setLoadingProccessImg02(false);
        setImagePreview2(response.data);
      }
    },
    [user?.token]
  );

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({ onDrop: onDrop1 });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({ onDrop: onDrop2 });
  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } =
    useDropzone({ onDrop: onDrop3 });

  const handleSubmitImageFront = async ({ image }: { image: string }) => {
    console.log(user?.token);
    const response = await axios.post(
      "/api/user/docs_update",
      {
        userId: params.userId,
        documentFront: image,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );
    // console.log(response);

    if (response.data.success == true) {
      toast.success("Parte frontal actualizada");
    } else {
      toast.error("la parte frontal no pudo actualizarse");
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

    if (response.data.success == true) {
      toast.success("Parte trasera actualizada");
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

  useEffect(() => {
    const getInfoUser = async () => {
      const response = await axios.post(
        "/api/user/list_docs",
        {
          userId: params.userId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      // console.log(response.data);
      setInfoUser(response.data.data);
      if (response.data && response.data.data && response.data.data[0]) {
        setImagePreview1(response.data.data[0].documentFront);
        setImagePreview2(response.data.data[0].documentBack);
      }
      setLoading(false);
    };

    getInfoUser();
  }, [params.userId, user?.token]);

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
              <h1>Datos Personales</h1>
              <div className={styles.centerBoxInputsInfo}>
                <div className={styles.partCenter}>
                  <div className={styles.boxPartInfo}>
                    <p>Cedula de Ciudadania</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          numberCc !== null
                            ? numberCc
                            : (infoUser && infoUser[0] && infoUser[0].number) ||
                              ""
                        }
                        onChange={(e) => setNumberCc(e.target.value)}
                      />
                      <button
                        className={styles.btnSaveInfo}
                        onClick={handleSubmitNumberCc}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Nombre</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={name !== null ? name : user.name || ""}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <button className={styles.btnSaveInfo}>Guardar</button>
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Email</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          detailEmail !== null ? detailEmail : user.email || ""
                        }
                        onChange={(e) => setDetailEmail(e.target.value)}
                      />
                      <button className={styles.btnSaveInfo}>Guardar</button>
                    </div>
                  </div>
                </div>

                {/* <div className={styles.partCenter}>
                  <div className={styles.boxPartInfo}>
                    <p>Cedula de Ciudadania</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          numberCc !== null
                            ? numberCc
                            : (infoUser && infoUser[0] && infoUser[0].number) ||
                              ""
                        }
                        onChange={(e) => setNumberCc(e.target.value)}
                      />
                      <button
                        className={styles.btnSaveInfo}
                        onClick={handleSubmitNumberCc}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Nombre</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          numberCc !== null
                            ? numberCc
                            : (infoUser && infoUser[0] && infoUser[0].number) ||
                              ""
                        }
                        onChange={(e) => setNumberCc(e.target.value)}
                      />
                      <button className={styles.btnSaveInfo}>Guardar</button>
                    </div>
                  </div>

                  <div className={styles.boxPartInfo}>
                    <p>Email</p>
                    <div className={styles.partChange}>
                      <input
                        className={styles.inputCC}
                        type="text"
                        value={
                          numberCc !== null
                            ? numberCc
                            : (infoUser && infoUser[0] && infoUser[0].number) ||
                              ""
                        }
                        onChange={(e) => setNumberCc(e.target.value)}
                      />
                      <button className={styles.btnSaveInfo}>Guardar</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <h1 className={styles.datesBox}>Datos Personales</h1>

          <div className={styles.containerDocumentsImgs}>
            <div className={styles.onlyImgsDocs}>
              <div className={styles.boxInfoUser} {...getRootProps1()}>
                <input {...getInputProps1()} />
                {imagePreview1 && imagePreview1 != "void" ? (
                  <>
                    {/* <Image
                      className={styles.avatarIcon}
                      src={imagePreview1}
                      alt="img01"
                      width={200}
                      height={300}
                    /> */}
                    <div className={styles.barStatusDocs}>
                      <div className={styles.headerCardStatus}>
                        <div className={styles.boxIconStatus}>
                          <TbCircleCheckFilled className={styles.iconCheck} />
                        </div>
                        <p className={styles.warninCC}>
                          Documento frontal subido
                        </p>
                      </div>
                      <div className={styles.boxIconsStatus}>
                        <div className={styles.boxIcon}>
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div className={styles.boxIcon}>
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className={styles.textPreview}>
                    {loadingProccessImg01 && "Processando tu documento"}
                    {!loadingProccessImg01 &&
                      "Toma una foto clara de la parte frontal de tu cedula"}
                  </p>
                )}
              </div>

              <div className={styles.boxInfoUser} {...getRootProps2()}>
                <input {...getInputProps2()} />
                {imagePreview2 && imagePreview2 != "void" ? (
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
                        <p className={styles.warninCC}>
                          Documento posterior subido
                        </p>
                      </div>
                      <div className={styles.boxIconsStatus}>
                        <div className={styles.boxIcon}>
                          <TbPhotoSearch
                            className={styles.viewIcon}
                            size={20}
                          />
                        </div>
                        <div className={styles.boxIcon}>
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className={styles.textPreview}>
                    {loadingProccessImg02 && "Processando tu documento"}
                    {!loadingProccessImg02 &&
                      "Toma una foto clara de la parte trasera de tu cedula"}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.cardLaboral}>
              {/* <h2>Ingresa tu carta laboral actualizada</h2> */}
              <div className={styles.boxInfoUser} {...getRootProps3()}>
                <input {...getInputProps3()} />
                {imagePreview2 && imagePreview2 != "void" ? (
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
                        <div className={styles.boxIcon}>
                          <TbFileSearch className={styles.viewIcon} size={20} />
                        </div>
                        <div className={styles.boxIcon}>
                          <TbTrash className={styles.trashIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className={styles.textPreview}>
                    {loadingProccessImg02 && "Processando tu documento"}
                    {!loadingProccessImg02 &&
                      "Sube tu carta laboral actualizada"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Profile;
