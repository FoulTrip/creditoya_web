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
      <div
        className={
          !openBarStatus && !inputsComplete
            ? styles.barPartOne
            : !inputsComplete
            ? styles.barPartOneOpen
            : styles.barPartOneOpenSucces
        }
        onClick={openBar}
      >
        <div className={styles.boxIconStatus}>
          {inputsComplete ? (
            <TbCircleCheck size={25} className={styles.incompleteFormIcon} />
          ) : (
            <TbCircleDashedX size={25} className={styles.incompleteFormIcon} />
          )}
        </div>
        <h4 className={styles.titleOpenBar}>{titleBar.toLocaleUpperCase()}</h4>
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
