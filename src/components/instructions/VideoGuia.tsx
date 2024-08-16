import React from "react";
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbVideo,
} from "react-icons/tb";
import styles from "./video.module.css";

interface VideoProps {
  switche: () => void;
  statusOpen: boolean;
}

function VideoGuia({ switche, statusOpen }: VideoProps) {
  return (
    <>
      <div className={styles.containerVideo}>
        <div className={styles.boxVideo}>
          <div className={styles.boxIconVideo}>
            <TbVideo className={styles.iconVideo} size={30} />
          </div>
          <div className={styles.boxTexts}>
            <div className={styles.Texts}>
              <h5>Video Tutorial</h5>
              <h3>Creacion de cuenta Credito Ya</h3>
            </div>
          </div>
        </div>

        <div className={styles.boxIconPlay}>
          {statusOpen == true && (
            <TbPlayerPauseFilled
              className={styles.iconPlay}
              size={23}
              onClick={switche}
            />
          )}

          {statusOpen == false && (
            <TbPlayerPlayFilled
              className={styles.iconPlay}
              size={23}
              onClick={switche}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default VideoGuia;
