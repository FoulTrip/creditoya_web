"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

import { TbAccessPoint, TbFingerprint } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Contract from "@/components/documents/Contract";
import { ScalarLoanApplication } from "@/types/User";

import CardLoan from "@/components/accesories/CardLoan";
import LoadingPage from "@/components/Loaders/LoadingPage";
import { ContractProvider } from "@/context/Contract";
import { toast } from "sonner";
import { useWebSocket } from "next-ws/client";
import { EventClient } from "@/types/ws";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);
  const [openContract, setOpenContract] = useState<boolean>(false);
  const [Loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);

  const ws = useWebSocket();

  useEffect(() => {
    const documentsVerify = async () => {
      const response = await axios.post(
        "/api/user/docs_exist",
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setCompleteDocs(response.data.data);
      setLoading(false);
    };

    if (user) {
      documentsVerify();
    } else {
      setLoading(false);
    }
  }, [user]);

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
  }, [user]);

  const newLoan = useCallback(async (event: MessageEvent<Blob>) => {
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
  }, []);

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

  if (user) {
    if (completeDocs) {
      return (
        <>
          <main className={styles.containerDashboard}>
            {!openContract && (
              <>
                {!openContract && (
                  <div className={styles.btnNew} onClick={handleOpenContract}>
                    <p>Solicitar Prestamo</p>
                  </div>
                )}

                <h1 className={styles.titleLoan}>Tus Prestamos</h1>
                <div className={styles.listLoans}>
                  {Loans?.filter((loan) => loan.userId === user.id).map(
                    (loan) => (
                      <CardLoan key={loan.id} loan={loan} />
                    )
                  )}
                </div>
              </>
            )}

            {openContract && (
              <Contract toggleContract={toggleContract} userId={user.id} />
            )}
          </main>
        </>
      );
    }

    if (!completeDocs) {
      return (
        <>
          <div className={styles.mainVoidDocuments}>
            <div className={styles.centerMainVoid}>
              <div className={styles.boxIconVoid}>
                <TbFingerprint className={styles.fingerIcon} size={300} />
              </div>
              <p>Completa tus datos antes de requerir un prestamo</p>
              <div className={styles.boxBtnComplete}>
                <button onClick={() => router.push(`/profile/${user.id}`)}>
                  Completar
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
  } else {
    router.push("/auth");
  }
}

export default Dashboard;
