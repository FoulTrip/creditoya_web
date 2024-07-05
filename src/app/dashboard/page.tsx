"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

import { useRouter } from "next/navigation";
import Contract from "@/components/documents/Contract";
import { ScalarLoanApplication } from "@/types/User";

import CardLoan from "@/components/accesories/CardLoan";
import LoadingPage from "@/components/Loaders/LoadingPage";
import { useWebSocket } from "next-ws/client";
import { TbFingerprint } from "react-icons/tb";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);
  const [openContract, setOpenContract] = useState<boolean>(false);
  const [Loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);

  const ws = useWebSocket();

  useEffect(() => {
    setLoading(true);
    const documentsVerify = async () => {
      const response = await axios.post(
        "/api/user/docs_exist",
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setCompleteDocs(response.data.data);
    };

    if (user) {
      documentsVerify();
      setLoading(false);
    } else {
      setLoading(false);
      setLoading(false);
    }
  }, [user, user?.token, user?.id]);

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post(
        "/api/user/loans",
        {
          userId: user?.id,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      // console.log(response.data)
      setLoans(response.data.data);
    };

    getAllLoans();
  }, [user, user?.token, user?.id]);

  const newLoan = useCallback(
    async (event: MessageEvent<Blob>) => {
      console.log(event);
      const JsonEvent = JSON.parse(String(event.data));

      console.log(JsonEvent);

      if (JsonEvent.type == "onNewState") {
        const response = await axios.post(
          "/api/user/loans",
          {
            userId: user?.id,
          },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );

        setLoans(response.data.data);
      }
    },
    [user?.id, user?.token]
  );

  useEffect(() => {
    ws?.addEventListener("message", newLoan);
    return () => ws?.removeEventListener("message", newLoan);
  }, [newLoan, ws]);

  const handleOpenContract = () => {
    // if (Loans?.length == 1) toast.error("Ya tienes un prestamo activo");
    // if (Loans?.length == 0) setOpenContract(!openContract);

    setOpenContract(!openContract);
  };

  const toggleContract = () => {
    setOpenContract(!openContract); // Cambia el estado de openContract al valor opuesto
  };

  if (loading) {
    return <LoadingPage />; // Aquí puedes reemplazar con tu componente de carga
  }

  if (!loading && completeDocs) {
    return (
      <>
        <main className={styles.containerDashboard}>
          {!openContract && (
            <>
              {!openContract && (
                <div className={styles.btnNew}>
                  <h5 onClick={handleOpenContract}>Solicitar Prestamo</h5>
                </div>
              )}
              <div className={styles.listLoans}>
                {Loans?.filter((loan) => loan.userId === user?.id).map(
                  (loan) => (
                    <CardLoan key={loan.id} loan={loan} />
                  )
                )}
              </div>
            </>
          )}

          {openContract && (
            <Contract
              toggleContract={toggleContract}
              userId={user?.id as string}
            />
          )}
        </main>
      </>
    );
  }

  if (!loading && !completeDocs) {
    return (
      <>
        <div className={styles.mainVoidDocuments}>
          <div className={styles.centerMainVoid}>
            <div className={styles.boxIconVoid}>
              <TbFingerprint className={styles.fingerIcon} size={300} />
            </div>
            <p>Completa tus datos antes de requerir un prestamo</p>
            <div className={styles.boxBtnComplete}>
              <button onClick={() => router.push(`/profile/${user?.id}`)}>
                Completar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
