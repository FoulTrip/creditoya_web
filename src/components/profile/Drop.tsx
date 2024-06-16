import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "@/app/profile/[userId]/page.module.css";
import {
  TbCircleCheckFilled,
  TbFileSearch,
  TbLicense,
  TbTrash,
} from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import axios from "axios";

function Drop03() {
  const { user } = useGlobalContext();
  const [imagePreview3, setImagePreview3] = useState("");
  const [loadingProccessImg03, setLoadingProccessImg03] = useState(false);
  const [openDocs, setOpenDocs] = useState<boolean>(false);
  const [contentOpenDoc, setContentOpenDoc] = useState<
    string | undefined | null
  >(user?.avatar);

  const handleOpenViewDocImg = () => {
    setOpenDocs(!openDocs);
  };

  const handleSetViewDocImg = ({ image }: { image: string }) => {
    setContentOpenDoc(image);
  };

  const onDrop3 = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setLoadingProccessImg03(true);
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const data = reader.result as string;
          const base64data = data.split(",")[1];
          const maxPartSize = 5000000;
          const fileParts: string[] = [];

          for (let i = 0; i < base64data.length; i += maxPartSize) {
            fileParts.push(base64data.slice(i, i + maxPartSize));
          }

          const userId = user?.id;

          try {
            const response = await axios.post(
              "/api/user/labor_letter",
              { userId, fileParts },
              { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            if (response.data.success) {
              setImagePreview3(response.data.data);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          } finally {
            setLoadingProccessImg03(false);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [user]
  );

  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } =
    useDropzone({ onDrop: onDrop3 });

  return (
    <>
      <div
        className={styles.boxInfoUser}
        {...(imagePreview3 === "No definido" ? getRootProps3() : {})}
      >
        {imagePreview3 === "No definido" && <input {...getInputProps3()} />}
        {imagePreview3 && imagePreview3 !== "No definido" ? (
          <>
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
              {!loadingProccessImg03 && "Sube tu carta laboral actualizada"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Drop03;
