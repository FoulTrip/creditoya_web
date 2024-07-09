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
    if (!user) {
      router.push("/auth");
      return;
    }

    const documentsVerify = async () => {
      try {
        const response = await axios.post(
          "/api/user/docs_exist",
          { userId: user.id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (response.data.success) {
          setCompleteDocs(response.data.data);
        } else {
          setCompleteDocs(false);
        }
      } catch (error) {
        console.error("Error verifying documents:", error);
        setCompleteDocs(false);
      } finally {
        setLoading(false);
      }
    };

    documentsVerify();
  }, [user, router]);

  useEffect(() => {
    if (user) {
      const getAllLoans = async () => {
        try {
          const response = await axios.post(
            "/api/user/loans",
            { userId: user.id },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          setLoans(response.data.data);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      };

      getAllLoans();
    }
  }, [user]);

  const newLoan = useCallback(
    async (event: MessageEvent<Blob>) => {
      console.log(event);
      const JsonEvent = JSON.parse(String(event.data));

      console.log(JsonEvent);

      if (JsonEvent.type === "onNewState") {
        const response = await axios.post(
          "/api/user/loans",
          { userId: user?.id },
          { headers: { Authorization: `Bearer ${user?.token}` } }
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
    setOpenContract(!openContract);
  };

  const toggleContract = () => {
    setOpenContract(!openContract);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (completeDocs === true) {
    return (
      <main className={styles.containerDashboard}>
        {!openContract && (
          <>
            <div className={styles.btnNew}>
              <h5 onClick={handleOpenContract}>Solicitar Prestamo</h5>
            </div>
            <div className={styles.listLoans}>
              {Loans?.filter((loan) => loan.userId === user?.id).map((loan) => (
                <CardLoan key={loan.id} loan={loan} />
              ))}
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
    );
  }

  if (completeDocs === false) {
    return (
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
    );
  }

  return null;
}

export default Dashboard;
