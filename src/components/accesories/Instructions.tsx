import React, { useState } from "react";
import styles from "./styles/instructions.module.css";
import DocsRequires from "../instructions/DocsRequires";
import FormRequest from "../instructions/FormReq";
import AnswerRequest from "../instructions/answerRequest";
import VideoGuia from "../instructions/VideoGuia";
import Video from "next-video";
import VideoGuiaSteps from "../videoGuia/VideoGuia";

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

      {openVideo == true && <VideoGuiaSteps />}

      {openVideo == false && (
        <>
          <DocsRequires />
          <FormRequest />
          <AnswerRequest />
        </>
      )}
    </>
  );
}

export default Instructions;
