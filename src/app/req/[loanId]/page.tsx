"use client";

import { useGlobalContext } from "@/context/Auth";
import { ScalarLoanApplication } from "@/types/User";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css"

function RequestInfo({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();
  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);

  useEffect(() => {
    const loanInfo = async () => {
      const response = await axios.post(
        "/api/loan/id",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      response.data.success === true && setInfoLoan(response.data.data);
    };

    loanInfo();
  }, [params.loanId, user]);

  return (
    <>
      <main className={styles.mainLoan}>
        <pre>{JSON.stringify(infoLoan, null, 2)}</pre>
      </main>
    </>
  );
}

export default RequestInfo;
