import React from "react";
import {
  TbCircleDashedX,
  TbX,
  TbCircleDashed,
  TbChevronDown,
  TbChevronUp,
  TbCircleCheck,
} from "react-icons/tb";
import styles from "./BarPart.module.css";

function BarParts({
  titleBar,
  openBar,
  openBarStatus,
  inputsComplete,
}: {
  titleBar: string;
  openBar: () => void;
  openBarStatus: boolean;
  inputsComplete: boolean;
}) {
  return (
    <>
      <div className={styles.barPartOne} onClick={openBar}>
        <div className={styles.boxIconStatus}>
          {inputsComplete ? (
            <TbCircleCheck size={20} className={styles.incompleteFormIcon} />
          ) : (
            <TbCircleDashedX size={20} className={styles.incompleteFormIcon} />
          )}
        </div>
        <h4 className={styles.titleOpenBar}>{titleBar}</h4>
        <div className={styles.BoxIconChevron}>
          {openBarStatus ? (
            <TbChevronUp size={20} />
          ) : (
            <TbChevronDown size={20} />
          )}
        </div>
      </div>
    </>
  );
}

export default BarParts;
