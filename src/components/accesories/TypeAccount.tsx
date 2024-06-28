import React, { useState } from "react";
import styles from "./styles/typeAccount.module.css";

interface AccountTypeProps {
  onSelectAccountType: (type: string) => void;
}

const AccountType: React.FC<AccountTypeProps> = ({ onSelectAccountType }) => {
  const [isSavings, setIsSavings] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

  const handleSavingsChange = () => {
    const newSavingsValue = !isSavings;
    setIsSavings(newSavingsValue);
    if (newSavingsValue) {
      setIsCurrent(false);
      onSelectAccountType("saving");
    } else {
      onSelectAccountType("");
    }
  };

  const handleCurrentChange = () => {
    const newCurrentValue = !isCurrent;
    setIsCurrent(newCurrentValue);
    if (newCurrentValue) {
      setIsSavings(false);
      onSelectAccountType("current");
    } else {
      onSelectAccountType("");
    }
  };

  return (
    <div className={styles.typeAccount}>
      <h5 className={styles.title}>Tipo de cuenta</h5>

      <div className={styles.barOptions}>
        <div className={styles.boxCheck}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={isSavings}
              onChange={handleSavingsChange}
            />
            Ahorro
          </label>
        </div>

        <div className={styles.boxCheck}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={handleCurrentChange}
            />
            Corriente
          </label>
        </div>
      </div>
    </div>
  );
};

export default AccountType;
