import React, { useRef, useState } from "react";
import Video from "next-video";
import styles from "./guia.module.css";
import { TbHistory, TbArrowUpRight } from "react-icons/tb";

interface TimesNamesProps {
  key: "newAccount" | "CompleteAccount" | "RequireLoan" | "panelReq";
  label: string;
  time: number;
}

const timesNames: TimesNamesProps[] = [
  { key: "newAccount", label: "Creacion de cuenta", time: 5 },
  { key: "CompleteAccount", label: "Completar datos del perfil", time: 53 },
  { key: "RequireLoan", label: "Solicitar tu primer prestamo", time: 116 },
  { key: "panelReq", label: "Panel de solicitudes de prestamo", time: 211 },
];

function VideoGuiaSteps() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeBtn, setActiveBtn] = useState<TimesNamesProps | null>(null);

  const handleJumpTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play(); // Opcional: para reproducir automaticamente
    }
  };

  const handleSelectTime = (time: number, object: TimesNamesProps) => {
    handleJumpTo(time);
    setActiveBtn(object);
  };

  return (
    <>
      <div className={styles.componentVideo}>
        <div className={styles.BoxVideo}>
          <Video
            ref={videoRef}
            className={styles.video}
            src={
              "https://res.cloudinary.com/dvquomppa/video/upload/v1724228923/videos_guia/u51npgvxsebnkhnhsh0x.mp4"
            }
            controls
          />
        </div>

        <div className={styles.BoxPartVideo}>
          <h1>Partes del video</h1>
          {timesNames.map((times) => (
            <>
              <div
                className={
                  activeBtn?.key == times.key
                    ? styles.btnStepActive
                    : styles.btnStep
                }
                key={times.key}
                onClick={() => handleSelectTime(times.time, times)}
              >
                <div className={styles.barBtnStep}>
                  <div className={styles.boxIconAccount}>
                    <TbHistory className={styles.AccountIcon} size={20} />
                  </div>
                  <p>{times.label}</p>
                </div>
                <div className={styles.boxIconxplore}>
                  <TbArrowUpRight className={styles.iconArrow} />
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default VideoGuiaSteps;
