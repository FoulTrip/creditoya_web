import React, { useState } from "react";
import styles from "./styles/instructions.module.css";
import DocsRequires from "../instructions/DocsRequires";
import FormRequest from "../instructions/FormReq";
import AnswerRequest from "../instructions/answerRequest";
import VideoGuia from "../instructions/VideoGuia";
import Video from "next-video";

function Instructions({ onClose }: { onClose: () => void }) {
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(!openVideo);
  };

  return (
    <>
      <div className={styles.headerInstructions}>
        <h1>Creacion de una solicitud de prestamo</h1>
        <div className={styles.boxCancelBtn} onClick={onClose}>
          <p>Cancelar</p>
        </div>
      </div>

      <VideoGuia switche={handleOpenVideo} statusOpen={openVideo} />

      {openVideo == true && (
        <Video
        style={{ marginTop: "1em" }}
          src={
            "https://res.cloudinary.com/dvquomppa/video/upload/v1722845128/videos_guia/iolghbmv7sycocooiu1v.mp4"
          }
        />
      )}
      <DocsRequires />
      <FormRequest />
      <AnswerRequest />
    </>
  );
}

export default Instructions;
